# Hướng dẫn Scale hệ thống Invoice MVP

> Tài liệu này dành cho khi hệ thống cần xử lý **2,000,000 hóa đơn/ngày**, với **80% dồn về giờ cao điểm 21h-23h**.
>
> **Cập nhật:** 2026-05-16

---

## Mục lục

1. [Bài toán & Yêu cầu kỹ thuật](#1-bài-toán--yêu-cầu-kỹ-thuật)
2. [Kiến trúc hiện tại (MVP)](#2-kiến-trúc-hiện-tại-mvp)
3. [Phân tích bottleneck](#3-phân-tích-bottleneck)
4. [Kiến trúc mục tiêu](#4-kiến-trúc-mục-tiêu)
5. [Roadmap migration](#5-roadmap-migration)
6. [Chi tiết từng phase](#6-chi-tiết-từng-phase)
7. [Chi phí ước tính](#7-chi-phí-ước-tính)
8. [Monitoring & Alerting](#8-monitoring--alerting)
9. [Rollback plan](#9-rollback-plan)

---

## 1. Bài toán & Yêu cầu kỹ thuật

### 1.1 Lưu lượng

```
Tổng hóa đơn/ngày:        2,000,000
Phân bố giờ cao điểm:    80% (1,600,000) trong 21h-23h
Phân bố giờ thường:      20% (400,000) trong 22h còn lại

Peak rate (21h-23h):      1,600,000 / 7,200s = ~222 TPS
Average rate (22h còn):   400,000 / 79,200s = ~5 TPS
```

### 1.2 SLA yêu cầu

| Metric | Yêu cầu |
|--------|---------|
| API response time (p50) | < 200ms |
| API response time (p95) | < 500ms |
| API response time (p99) | < 1s |
| T-VAN submission success | > 99.5% |
| Uptime | 99.9% (8.76h downtime/năm) |
| Data durability | 99.999999% (11 nines) |
| Recovery Time Objective (RTO) | < 15 phút |
| Recovery Point Objective (RPO) | < 1 phút |

### 1.3 Constraints

- Budget target: < $100/tháng infrastructure
- Team size: 1-2 developers
- Must maintain backward compatibility với Haravan ecosystem
- Tuân thủ quy định hóa đơn điện tử Việt Nam

---

## 2. Kiến trúc hiện tại (MVP)

### 2.1 Architecture diagram

```
┌──────────────┐     ┌──────────────────┐     ┌─────────┐
│  React SPA   │────▶│  Hono Worker     │────▶│  D1     │
│  (CF Pages)  │     │  (CF Workers)    │     │ (SQLite)│
└──────────────┘     │                  │     └─────────┘
                     │  12 endpoints    │     ┌─────────┐
                     │  SYNCHRONOUS     │────▶│  KV     │
                     └──────────────────┘     └─────────┘
                              │                ┌─────────┐
                              └───────────────▶│  R2     │
                                               └─────────┘
```

### 2.2 Tech stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Cloudflare Workers | Wrangler v4.14+ |
| API Framework | Hono | v4.7+ |
| Frontend | React + TypeScript | 18.3 / 5.7 |
| Database | Cloudflare D1 | SQLite at edge |
| Cache | Cloudflare KV | Key-Value store |
| Object Storage | Cloudflare R2 | PDF storage |
| Build | Vite + pnpm | 6.3 / v9 monorepo |

### 2.3 Current processing flow (SYNCHRONOUS)

```
POST /api/v1/invoices
  1. Check idempotency key (KV)
  2. Validate input
  3. Calculate totals
  4. INSERT D1 (status=pending)
  5. Call T-VAN adapter ◀── BLOCKING 500-800ms
  6. UPDATE D1 status
  7. Write audit log
  8. Return response
```

### 2.4 Current limits (Free Tier)

| Service | Free Tier Limit | Cần cho 2M/ngày |
|---------|----------------|-----------------|
| Workers | 100K req/ngày | 2M |
| D1 | 100K writes/ngày | 2M+ |
| KV | 1K writes/ngày | 2M+ |
| R2 | 1M ops/tháng | 60M/tháng |

---

## 3. Phân tích bottleneck

### 3.1 Critical bottlenecks

#### 3.1.1 Synchronous T-VAN adapter calls

```typescript
// ❌ HIỆN TẠI: Block request chờ T-VAN
const result = await adapter.issue(invoice);  // 500-800ms blocking
await db.prepare('UPDATE invoices SET status = ?').bind(result.status).run();
return c.json({ success: true, data: invoice });
```

**Vấn đề:**
- Mỗi Worker isolate chỉ xử lý 1 request tại một thời điểm
- 222 TPS peak × 500ms = cần 111 concurrent isolates liên tục
- T-VAN timeout (3s) sẽ cascade failure toàn bộ pipeline

#### 3.1.2 D1 write throughput

```
Free tier:   100K writes/ngày
Cần:         2M writes/ngày (invoices + audit_logs)
Thiếu:       20x
```

#### 3.1.3 KV write throughput

```
Free tier:   1K writes/ngày
Cần:         2M writes/ngày (idempotency keys)
Thiếu:       2000x
```

### 3.2 Medium bottlenecks

| Bottleneck | Tác động | Giải pháp |
|------------|----------|-----------|
| Offset pagination | `LIMIT/OFFSET` scan full table ở page cao | Cursor-based pagination |
| No caching | Mọi request hit D1 trực tiếp | KV caching layer |
| No rate limiting | 1 merchant có thể spam 222 TPS | Sliding window rate limit |
| No circuit breaker | T-VAN down = queue full = memory spike | Circuit breaker pattern |
| No retry logic | T-VAN timeout 1 lần = mất invoice | Exponential backoff + DLQ |
| JSON items column | Không index được, query chậm ở scale lớn | Normalize hoặc computed columns |

### 3.3 Không phải bottleneck nhưng cần cải thiện

- Mock auth → Cần OAuth2 trước khi production
- Inline styles → Cần TailwindCSS cho maintainability
- No monitoring → Cần observability stack

---

## 4. Kiến trúc mục tiêu

### 4.1 Architecture diagram

```
                              222 TPS peak
                                   │
                                   ▼
┌─────────────┐            ┌──────────────┐            ┌───────────────────┐
│  React SPA  │───────▶    │  CF Workers  │    ──────▶ │  CF Queues        │
│  (Pages)    │            │  (API GW)    │            │  (Buffer)         │
│             │◀── 202 ───│              │            │                   │
│  Polling    │            │  - Validate  │            │  Backpressure     │
│  status     │            │  - D1 insert │            │  smoothing        │
│             │            │  - Queue push│            │                   │
└─────────────┘            └──────────────┘            └───────────────────┘
                                   │                            │
                                   ▼                            ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          CF Workers (Consumers)                          │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Consumer 1  │  │ Consumer 2  │  │ Consumer 3  │  │ Consumer N  │    │
│  │             │  │             │  │             │  │             │    │
│  │ - T-VAN call│  │ - T-VAN call│  │ - T-VAN call│  │ - T-VAN call│    │
│  │ - D1 update │  │ - D1 update │  │ - D1 update │  │ - D1 update │    │
│  │ - Retry     │  │ - Retry     │  │ - Retry     │  │ - Retry     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                          │
│  Circuit Breaker ─── Exponential Backoff ─── Dead Letter Queue          │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌─────────┐          ┌─────────┐          ┌─────────┐
        │   D1    │          │   KV    │          │   R2    │
        │ (Paid)  │          │ (Paid)  │          │ (PDF)   │
        │ 10GB+   │          │ Unlimited│         │         │
        └─────────┘          └─────────┘          └─────────┘
              │
              ▼
        ┌─────────────┐
        │ Cron Worker  │
        │ - Aggregate  │
        │ - Cleanup    │
        │ - Monitoring │
        └─────────────┘
```

### 4.2 Async processing flow

```
POST /api/v1/invoices
  1. Rate limit check (KV sliding window)
  2. Idempotency check (KV)
  3. Validate input
  4. Calculate totals
  5. INSERT D1 (status=pending)
  6. Push to Queue ◀── NON-BLOCKING, < 10ms
  7. Cache response in KV
  8. Return 202 Accepted

  Response:
  {
    "success": true,
    "data": { "id": "inv_xxx", "status": "pending" },
    "message": "Invoice is being processed"
  }
```

```
Queue Consumer (background, async)
  1. Dequeue message (batch 10-50)
  2. For each invoice:
     a. Call T-VAN adapter (circuit breaker protected)
     b. Success: UPDATE D1 status = 'issued', set tvan_id
     c. Failure: Increment retry count
        - Retry < 3: Re-queue with exponential backoff
        - Retry >= 3: Move to Dead Letter Queue
     d. Write audit log (batch insert)
  3. ACK processed messages
```

### 4.3 Client polling flow

```
Client                          API Worker
  │                                │
  │  POST /invoices ──────────────▶│
  │◀── 202 { id: "inv_xxx" } ─────│
  │                                │
  │  GET /invoices/inv_xxx ───────▶│
  │◀── { status: "pending" } ─────│
  │                                │
  │  (sau 1-3 giây)                │
  │  GET /invoices/inv_xxx ───────▶│
  │◀── { status: "issued" } ──────│
  │                                │
```

### 4.4 Data model changes

```sql
-- Thêm merchant_id để multi-tenant query tối ưu
ALTER TABLE invoices ADD COLUMN merchant_id TEXT NOT NULL DEFAULT '';

-- Thêm retry tracking cho queue processing
ALTER TABLE invoices ADD COLUMN retry_count INTEGER DEFAULT 0;
ALTER TABLE invoices ADD COLUMN last_error TEXT;
ALTER TABLE invoices ADD COLUMN queued_at TEXT;
ALTER TABLE invoices ADD COLUMN completed_at TEXT;

-- Thêm index cho queue queries
CREATE INDEX idx_invoices_pending ON invoices(status, created_at)
  WHERE status = 'pending';

-- Thêm bảng Dead Letter Queue
CREATE TABLE dead_letter_queue (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  error TEXT NOT NULL,
  retry_count INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- Thêm bảng rate limit tracking (hoặc dùng KV)
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
```

### 4.5 Updated database schema

```sql
-- Bảng hiện tại (giữ nguyên)
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  haravan_id TEXT,
  tvan_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  -- ... existing columns ...

  -- Thêm mới cho async processing
  merchant_id TEXT NOT NULL DEFAULT '',
  retry_count INTEGER DEFAULT 0,
  last_error TEXT,
  queued_at TEXT,
  completed_at TEXT
);

-- Bảng mới
CREATE TABLE dead_letter_queue (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  error TEXT NOT NULL,
  retry_count INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
```

---

## 5. Roadmap migration

### Overview

```
Phase 1: Foundation        Phase 2: Resilience       Phase 3: Scale
(Tuần 1-2)                 (Tuần 3-4)                (Tháng 2)
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│ - Upgrade CF    │        │ - Circuit breaker│        │ - KV caching    │
│   Paid tier     │        │ - Exponential    │        │ - Read replicas │
│ - Implement     │  ────▶ │   backoff        │  ────▶ │ - Batch reports │
│   CF Queues     │        │ - Dead Letter    │        │ - Monitoring    │
│ - Async pipeline│        │   Queue          │        │ - Alerting      │
│ - Rate limiting │        │ - Cursor         │        │ - Auto-scaling  │
│   middleware    │        │   pagination     │        │                 │
└─────────────────┘        └─────────────────┘        └─────────────────┘

Downtime: Zero (blue-green deployment)
Rollback: Feature flags, instant revert
```

### Milestones

| Phase | Duration | Goal | Success Criteria |
|-------|----------|------|------------------|
| Phase 1 | 2 tuần | Async foundation | POST /invoices trả 202, queue processing hoạt động |
| Phase 2 | 2 tuần | Production resilience | 99.5% success rate, retry hoạt động, DLQ bắt lỗi |
| Phase 3 | 4 tuần | Scale to 2M/ngày | 222 TPS sustained, p95 < 500ms, $100/tháng |

---

## 6. Chi tiết từng phase

### Phase 1: Foundation (Tuần 1-2)

#### 6.1.1 Upgrade Cloudflare plan

```bash
# Đăng ký Workers Paid ($5/mo)
# Trong Cloudflare Dashboard > Workers & Pages > Plans

# Cập nhật wrangler.toml
# Không cần thay đổi, tự động hưởng limits mới khi upgrade
```

**Workers Paid limits:**
- Requests: Không giới hạn
- CPU time: 30s/req (vs 10ms free)
- D1: Unlimited reads/writes
- KV: Unlimited reads/writes
- Queues: 1M messages/tháng free, $0.40/M sau đó

#### 6.1.2 Implement Cloudflare Queues

```typescript
// wrangler.toml
[[queues.producers]]
queue = "invoice-processing"
binding = "INVOICE_QUEUE"

[[queues.consumers]]
queue = "invoice-processing"
max_batch_size = 50
max_batch_timeout = 5
max_retries = 3
dead_letter_queue = "invoice-dlq"

[[queues.producers]]
queue = "invoice-dlq"
binding = "DLQ_QUEUE"
```

```typescript
// src/services/queue.ts
export class InvoiceQueue {
  constructor(private queue: Queue) {}

  async enqueue(invoice: Invoice): Promise<void> {
    await this.queue.send({
      id: invoice.id,
      merchantId: invoice.merchantId,
      payload: invoice,
      attempts: 0,
      enqueuedAt: new Date().toISOString(),
    });
  }
}
```

#### 6.1.3 Async invoice creation

```typescript
// src/routes/invoices.ts - UPDATED
app.post('/api/v1/invoices', authMiddleware, async (c) => {
  const body = await c.req.json();
  const merchantId = c.get('merchantId');

  // 1. Rate limit check
  await rateLimit(c.env.KV, merchantId, 1000, 60); // 1000/min

  // 2. Idempotency check
  const idempotencyKey = c.req.header('X-Idempotency-Key');
  if (idempotencyKey) {
    const cached = await c.env.KV.get(`idem:${idempotencyKey}`);
    if (cached) return c.json(JSON.parse(cached));
  }

  // 3. Validate
  const validated = validateInvoice(body);

  // 4. Calculate totals
  const totals = calculateTotals(validated);

  // 5. Insert D1 (status=pending)
  const invoice = await db.prepare(`
    INSERT INTO invoices (id, merchant_id, status, buyer_name, buyer_mst, ...)
    VALUES (?, ?, 'pending', ?, ?, ...)
  `).bind(/* ... */).run();

  // 6. Push to Queue (NON-BLOCKING, < 10ms)
  await c.env.INVOICE_QUEUE.send({
    id: invoice.id,
    merchantId,
    payload: { ...validated, ...totals },
  });

  // 7. Return 202 Accepted
  const response = {
    success: true,
    data: { id: invoice.id, status: 'pending' },
    message: 'Invoice is being processed',
  };

  // Cache for idempotency
  if (idempotencyKey) {
    await c.env.KV.put(`idem:${idempotencyKey}`, JSON.stringify(response), {
      expirationTtl: 86400,
    });
  }

  return c.json(response, 202);
});
```

#### 6.1.4 Queue consumer

```typescript
// src/consumers/invoice-processor.ts
export default {
  async queue(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
    const db = env.DB;
    const adapter = createAdapter(env);

    // Process batch
    const results = await Promise.allSettled(
      batch.messages.map(async (msg) => {
        try {
          // Call T-VAN adapter
          const result = await adapter.issue(msg.body.payload);

          // Update D1
          await db.prepare(`
            UPDATE invoices
            SET status = 'issued', tvan_id = ?, completed_at = datetime('now')
            WHERE id = ?
          `).bind(result.tvanId, msg.body.id).run();

          // Audit log
          await db.prepare(`
            INSERT INTO audit_logs (id, invoice_id, action, actor, details)
            VALUES (?, ?, 'issued', 'system', ?)
          `).bind(crypto.randomUUID(), msg.body.id, JSON.stringify(result)).run();

          msg.ack();
        } catch (error) {
          msg.retry();
        }
      })
    );

    // Log metrics
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    console.log(`Processed batch: ${succeeded} succeeded, ${failed} failed`);
  },
};
```

#### 6.1.5 Rate limiting middleware

```typescript
// src/middleware/rate-limit.ts
export async function rateLimit(
  kv: KVNamespace,
  key: string,
  limit: number,
  windowSec: number
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rl:${key}:${Math.floor(now / windowSec)}`;

  const current = await kv.get(windowKey);
  const count = current ? parseInt(current) : 0;

  if (count >= limit) {
    throw new HttpException(429, {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. Max ${limit} requests per ${windowSec}s`,
    });
  }

  await kv.put(windowKey, String(count + 1), {
    expirationTtl: windowSec * 2,
  });
}
```

#### 6.1.6 Testing checklist (Phase 1)

- [ ] POST /invoices trả 202 với status=pending
- [ ] Queue consumer nhận và xử lý message
- [ ] D1 update status sau khi T-VAN thành công
- [ ] Client poll GET /invoices/:id thấy status thay đổi
- [ ] Rate limit trả 429 khi vượt quá
- [ ] Idempotency key trả response cũ
- [ ] Audit log được tạo đúng

---

### Phase 2: Resilience (Tuần 3-4)

#### 6.2.1 Circuit breaker

```typescript
// src/lib/circuit-breaker.ts
interface CircuitBreakerOptions {
  failureThreshold: number;    // Số lỗi liên tiếp trước khi open
  resetTimeout: number;        // Thời gian chờ trước khi thử lại (ms)
  halfOpenMax: number;         // Số request thử trong half-open state
}

type CircuitState = 'closed' | 'open' | 'half-open';

export class CircuitBreaker<T extends (...args: any[]) => Promise<any>> {
  private state: CircuitState = 'closed';
  private failureCount = 0;
  private lastFailureTime = 0;
  private halfOpenCount = 0;

  constructor(
    private fn: T,
    private options: CircuitBreakerOptions
  ) {}

  async execute(...args: Parameters<T>): Promise<ReturnType<T>> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.options.resetTimeout) {
        this.state = 'half-open';
        this.halfOpenCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await this.fn(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === 'half-open') {
      this.state = 'closed';
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'half-open') {
      this.state = 'open';
    } else if (this.failureCount >= this.options.failureThreshold) {
      this.state = 'open';
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Usage trong consumer
const circuitBreaker = new CircuitBreaker(adapter.issue, {
  failureThreshold: 5,
  resetTimeout: 30000,  // 30s
  halfOpenMax: 3,
});
```

#### 6.2.2 Exponential backoff retry

```typescript
// src/lib/retry.ts
interface RetryOptions {
  maxRetries: number;
  baseDelay: number;      // ms
  maxDelay: number;        // ms
  backoffMultiplier: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < options.maxRetries) {
        const delay = Math.min(
          options.baseDelay * Math.pow(options.backoffMultiplier, attempt),
          options.maxDelay
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Usage
const result = await withRetry(
  () => adapter.issue(invoice),
  {
    maxRetries: 3,
    baseDelay: 1000,     // 1s
    maxDelay: 30000,     // 30s
    backoffMultiplier: 2,
  }
);
```

#### 6.2.3 Dead Letter Queue processing

```typescript
// src/consumers/dlq-processor.ts
export default {
  async queue(batch: MessageBatch<DLQMessage>, env: Env): Promise<void> {
    for (const msg of batch.messages) {
      // Store in D1 for manual review
      await env.DB.prepare(`
        INSERT INTO dead_letter_queue (id, invoice_id, payload, error, retry_count, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        crypto.randomUUID(),
        msg.body.id,
        JSON.stringify(msg.body.payload),
        msg.body.error,
        msg.body.attempts
      ).run();

      // Alert via webhook (Slack, email, etc.)
      await notifyOps({
        type: 'DLQ_MESSAGE',
        invoiceId: msg.body.id,
        error: msg.body.error,
        attempts: msg.body.attempts,
      });

      msg.ack();
    }
  },
};
```

#### 6.2.4 Cursor-based pagination

```typescript
// src/routes/invoices.ts - UPDATED
app.get('/api/v1/invoices', authMiddleware, async (c) => {
  const merchantId = c.get('merchantId');
  const cursor = c.req.query('cursor');  // Invoice ID
  const limit = parseInt(c.req.query('limit') || '50');

  let query = `
    SELECT * FROM invoices
    WHERE merchant_id = ?
  `;
  const params: any[] = [merchantId];

  if (cursor) {
    // Cursor-based: lấy records sau cursor
    query += ` AND created_at < (SELECT created_at FROM invoices WHERE id = ?)`;
    params.push(cursor);
  }

  query += ` ORDER BY created_at DESC LIMIT ?`;
  params.push(limit + 1); // +1 để check hasMore

  const rows = await env.DB.prepare(query).bind(...params).all();
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return c.json({
    success: true,
    data: {
      items,
      nextCursor,
      hasMore,
    },
  });
});
```

#### 6.2.5 Testing checklist (Phase 2)

- [ ] Circuit breaker chuyển sang OPEN sau 5 lỗi liên tiếp
- [ ] Circuit breaker chuyển sang HALF-OPEN sau 30s
- [ ] Circuit breaker đóng lại khi request thành công
- [ ] Retry với exponential backoff hoạt động (1s → 2s → 4s)
- [ ] DLQ bắt message sau 3 lần retry thất bại
- [ ] DLQ alert gửi notification
- [ ] Cursor pagination trả đúng kết quả
- [ ] Cursor pagination performant với 1M+ records

---

### Phase 3: Scale (Tháng 2)

#### 6.3.1 KV caching layer

```typescript
// src/lib/cache.ts
export class CacheLayer {
  constructor(private kv: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.kv.get(key, 'json');
    return cached as T | null;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.kv.put(key, JSON.stringify(value), { expirationTtl: ttl });
  }

  async getOrSet<T>(
    key: string,
    ttl: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const fresh = await fetcher();
    await this.set(key, fresh, ttl);
    return fresh;
  }
}

// Cache strategies
const CACHE_TTL = {
  MST_LOOKUP: 30 * 24 * 3600,    // 30 ngày - MST hiếm khi thay đổi
  MERCHANT_CONFIG: 3600,           // 1 giờ
  CUSTOMER_INFO: 24 * 3600,       // 1 ngày
  REPORT_SUMMARY: 300,            // 5 phút
};

// Usage
const mstInfo = await cache.getOrSet(
  `mst:${buyerMst}`,
  CACHE_TTL.MST_LOOKUP,
  () => db.prepare('SELECT * FROM customers WHERE mst = ?').bind(buyerMst).first()
);
```

#### 6.3.2 Database optimization

```typescript
// Batch inserts cho audit logs (thay vì từng insert)
async function batchAuditLogs(db: D1Database, logs: AuditLog[]): Promise<void> {
  const stmt = db.prepare(`
    INSERT INTO audit_logs (id, invoice_id, action, actor, details, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `);

  const batch = logs.map(log =>
    stmt.bind(log.id, log.invoiceId, log.action, log.actor, JSON.stringify(log.details))
  );

  await db.batch(batch);
}

// Batch updates cho invoice status
async function batchUpdateStatus(
  db: D1Database,
  updates: Array<{ id: string; status: string; tvanId?: string }>
): Promise<void> {
  const stmt = db.prepare(`
    UPDATE invoices
    SET status = ?, tvan_id = COALESCE(?, tvan_id), completed_at = datetime('now')
    WHERE id = ?
  `);

  const batch = updates.map(u =>
    stmt.bind(u.status, u.tvanId || null, u.id)
  );

  await db.batch(batch);
}
```

#### 6.3.3 Consumer scaling

```typescript
// wrangler.toml - Tăng consumer capacity
[[queues.consumers]]
queue = "invoice-processing"
max_batch_size = 100        # Tăng từ 50 lên 100
max_batch_timeout = 3       # Giảm từ 5s xuống 3s (nhanh hơn)
max_concurrency = 10        # Số messages xử lý đồng thời
max_retries = 3
dead_letter_queue = "invoice-dlq"

# Có thể tạo nhiều consumer workers nếu cần
# CF tự động scale consumers dựa trên queue depth
```

#### 6.3.4 Monitoring setup

```typescript
// src/lib/metrics.ts
export class MetricsCollector {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  async increment(metric: string, value: number = 1): Promise<void> {
    const key = `metrics:${metric}:${this.getCurrentMinute()}`;
    const current = parseInt(await this.kv.get(key) || '0');
    await this.kv.put(key, String(current + value), { expirationTtl: 3600 });
  }

  async getRate(metric: string, minutes: number = 5): Promise<number> {
    let total = 0;
    for (let i = 0; i < minutes; i++) {
      const key = `metrics:${metric}:${this.getMinuteOffset(i)}`;
      total += parseInt(await this.kv.get(key) || '0');
    }
    return total / minutes;
  }

  private getCurrentMinute(): string {
    return Math.floor(Date.now() / 60000).toString();
  }

  private getMinuteOffset(offset: number): string {
    return (Math.floor(Date.now() / 60000) - offset).toString();
  }
}

// Usage trong consumer
await metrics.increment('invoices.processed');
await metrics.increment('invoices.failed');
await metrics.increment('tvan.latency', latencyMs);
```

#### 6.3.5 Alert rules

```yaml
# alerting-rules.yaml (Cloudflare Workers Analytics)
alerts:
  - name: high_error_rate
    condition: error_rate > 5%
    duration: 5m
    severity: critical
    action: notify_ops

  - name: high_latency
    condition: p95_latency > 1000ms
    duration: 5m
    severity: warning
    action: notify_ops

  - name: queue_depth_high
    condition: queue_depth > 10000
    duration: 2m
    severity: critical
    action: scale_consumers

  - name: dlq_messages
    condition: dlq_count > 100
    duration: 1h
    severity: warning
    action: notify_ops

  - name: circuit_breaker_open
    condition: circuit_state == 'open'
    duration: 1m
    severity: critical
    action: notify_ops
```

#### 6.3.6 Testing checklist (Phase 3)

- [ ] KV cache hit rate > 80% cho MST lookup
- [ ] Batch audit logs giảm 80% D1 writes
- [ ] Consumer xử lý 222 TPS sustained trong 2 giờ
- [ ] p95 latency < 500ms ở peak load
- [ ] Alert trigger đúng khi error rate > 5%
- [ ] Queue depth không vượt 10K ở peak
- [ ] Total infrastructure cost < $100/tháng

---

## 7. Chi phí ước tính

### 7.1 Chi phí theo phase

#### Phase 1: Foundation

| Service | Pricing | Chi phí |
|---------|---------|---------|
| Workers Paid | $5/mo base | $5.00 |
| D1 (Paid tier) | Unlimited writes | $0.00 |
| KV (Paid tier) | Unlimited writes | $0.00 |
| Queues | 1M free, $0.40/M sau | $0.40 |
| **Total** | | **$5.40** |

#### Phase 2: Resilience

| Service | Pricing | Chi phí |
|---------|---------|---------|
| Workers Paid | $5/mo base | $5.00 |
| D1 | Unlimited | $0.00 |
| KV | Unlimited | $0.00 |
| Queues | 2M messages | $0.80 |
| DLQ storage | Minimal | $0.00 |
| **Total** | | **$5.80** |

#### Phase 3: Scale (2M invoices/ngày)

| Service | Pricing calculation | Chi phí/tháng |
|---------|-------------------|---------------|
| Workers Paid | $5 base + $0.30/1M × 60M req | $23.00 |
| D1 | Included trong Paid | $0.00 |
| KV | Included trong Paid | $0.00 |
| Queues | $0.40/1M × 60M messages | $24.00 |
| R2 | $5 base + storage | $6.00 |
| **Total** | | **$53.00** |

### 7.2 Cost optimization tips

```
1. Batch queue messages (giảm 50% queue costs)
   - Thay vì 1 message/invoice → batch 10 invoices/message
   - Tiết kiệm: $12/tháng

2. Cache aggressively (giảm 70% D1 reads)
   - MST lookup: 30d TTL
   - Config: 1h TTL
   - Customer: 1d TTL

3. Compress queue payloads (giảm bandwidth)
   - JSON → gzip cho large invoices
   - Tiết kiệm: ~$2/tháng

4. Off-peak batch processing
   - Reports chạy lúc 3-5 AM
   - Archive old data vào R2
```

---

## 8. Monitoring & Alerting

### 8.1 Key metrics

```typescript
// Core metrics cần theo dõi
const METRICS = {
  // Throughput
  'invoices.created': 'Counter',      // Số invoice tạo mới
  'invoices.processed': 'Counter',    // Số invoice xử lý xong
  'invoices.failed': 'Counter',       // Số invoice thất bại

  // Latency
  'api.latency': 'Histogram',         // API response time
  'tvan.latency': 'Histogram',        // T-VAN call time
  'queue.latency': 'Histogram',       // Queue processing time

  // Errors
  'errors.api': 'Counter',            // API errors
  'errors.tvan': 'Counter',           // T-VAN errors
  'errors.queue': 'Counter',          // Queue errors

  // Resources
  'queue.depth': 'Gauge',             // Queue depth hiện tại
  'dlq.count': 'Gauge',              // DLQ messages
  'circuit.state': 'Gauge',          // Circuit breaker state

  // Business
  'invoices.issued': 'Counter',       // Hóa đơn phát hành thành công
  'invoices.replaced': 'Counter',     // Hóa đơn thay thế
  'invoices.adjusted': 'Counter',     // Hóa đơn điều chỉnh
};
```

### 8.2 Dashboard layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  INVOICE SYSTEM DASHBOARD                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ TPS (realtime)│  │ Success Rate │  │ p95 Latency  │              │
│  │    222       │  │   99.7%      │  │   380ms      │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  TPS over time (24h)                                        │   │
│  │  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████████████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁   │   │
│  │  00:00              12:00    21:00  23:00              00:00 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Queue Depth  │  │ DLQ Count    │  │ Circuit State│              │
│  │    1,234     │  │     12       │  │   CLOSED     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Recent Errors                                              │   │
│  │  12:34:05 - T-VAN timeout for inv_abc123 (retry 1/3)       │   │
│  │  12:33:45 - Rate limit exceeded for merchant_xyz           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.3 Alert destinations

| Severity | Channel | Response time |
|----------|---------|---------------|
| Critical | PagerDuty + Slack #ops | < 5 phút |
| Warning | Slack #ops | < 30 phút |
| Info | Email digest | Hàng ngày |

---

## 9. Rollback plan

### 9.1 Feature flags

```typescript
// src/config/feature-flags.ts
export const FEATURE_FLAGS = {
  // Phase 1
  ASYNC_PROCESSING: {
    enabled: true,
    rolloutPercentage: 100,  // 0-100
  },

  // Phase 2
  CIRCUIT_BREAKER: {
    enabled: true,
    rolloutPercentage: 100,
  },

  CURSOR_PAGINATION: {
    enabled: false,  // Chưa bật
    rolloutPercentage: 0,
  },

  // Phase 3
  KV_CACHING: {
    enabled: true,
    rolloutPercentage: 50,  // Chỉ 50% traffic
  },
};
```

### 9.2 Rollback procedures

#### Rollback Phase 1 (Async → Sync)

```typescript
// Nếu queue có vấn đề, revert về sync processing
app.post('/api/v1/invoices', authMiddleware, async (c) => {
  if (!FEATURE_FLAGS.ASYNC_PROCESSING.enabled) {
    // SYNC MODE (old behavior)
    const result = await adapter.issue(invoice);
    await db.prepare('UPDATE invoices SET status = ?').bind(result.status).run();
    return c.json({ success: true, data: invoice });
  }

  // ASYNC MODE (new behavior)
  await c.env.INVOICE_QUEUE.send({ id: invoice.id, payload: invoice });
  return c.json({ success: true, data: { id: invoice.id, status: 'pending' } }, 202);
});
```

#### Rollback Phase 2 (Circuit breaker)

```typescript
// Disable circuit breaker nếu gây vấn đề
const adapterCall = FEATURE_FLAGS.CIRCUIT_BREAKER.enabled
  ? circuitBreaker.execute(invoice)
  : adapter.issue(invoice);
```

#### Rollback Phase 3 (Caching)

```typescript
// Bypass cache nếu có data inconsistency
const result = FEATURE_FLAGS.KV_CACHING.enabled
  ? await cache.getOrSet(key, ttl, fetcher)
  : await fetcher();
```

### 9.3 Emergency procedures

```
1. QUEUE FULL (depth > 100K)
   → Tạm dừng nhận invoice mới (return 503)
   → Scale up consumers
   → Clear queue backlog

2. T-VAN DOWN (circuit breaker OPEN)
   → Chuyển sang mode "draft only" (không gọi T-VAN)
   → Invoice status = 'draft', chờ manual processing
   → Alert ops team

3. D1 OVERLOAD (slow queries)
   → Enable aggressive caching (TTL = 1h)
   → Reduce query complexity
   → Consider read replicas

4. COST SPIKE (vượt budget)
   → Reduce queue batch size
   → Enable more aggressive caching
   → Review and optimize queries
```

---

## Appendix

### A. Environment variables

```bash
# .env.production
ENVIRONMENT=production
CF_ACCOUNT_ID=xxx
CF_API_TOKEN=xxx

# D1
D1_DATABASE_ID=xxx

# KV
KV_NAMESPACE_ID=xxx

# Queues
INVOICE_QUEUE_ID=xxx
DLQ_QUEUE_ID=xxx

# T-VAN
TVAN_API_URL=https://api.hilo.vn/v1
TVAN_API_KEY=xxx
TVAN_TIMEOUT=5000

# Rate limiting
RATE_LIMIT_REQUESTS=1000
RATE_LIMIT_WINDOW=60

# Feature flags
FF_ASYNC_PROCESSING=true
FF_CIRCUIT_BREAKER=true
FF_KV_CACHING=true
```

### B. Useful commands

```bash
# Deploy
wrangler deploy

# Deploy specific worker
wrangler deploy --config wrangler.consumer.toml

# View logs
wrangler tail

# Check queue depth
wrangler queues list

# Purge queue
wrangler queues purge invoice-processing

# Database operations
wrangler d1 execute haravan-invoice-mvp --command "SELECT COUNT(*) FROM invoices"

# KV operations
wrangler kv:key list --namespace-id=xxx
```

### C. Reference documents

- [Cloudflare Queues documentation](https://developers.cloudflare.com/queues/)
- [Cloudflare D1 documentation](https://developers.cloudflare.com/d1/)
- [Circuit Breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
- [Exponential backoff](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

---

> **Lưu ý:** Tài liệu này được viết dựa trên kiến trúc MVP hiện tại (2026-05-16).
> Khi bắt đầu thực hiện phase nào, hãy review lại các section liên quan để đảm bảo
> không có thay đổi lớn nào từ lần cập nhật cuối.
