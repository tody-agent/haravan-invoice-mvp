# FEATURE PROMPT — TVANAdapter Pattern + HiloAdapter

**Phase:** 1 (foundation), reused mọi phase · **Effort:** 4-5 ngày
**Pre-read:** Master Context §3 (Tầng 1-2, multi-T-VAN), Phase 1 §"Gateway Service Design", ADR-002

---

## Mục tiêu

Implement adapter pattern cho phép Gateway gọi nhiều T-VAN khác nhau với cùng interface. Phase 1 chỉ implement HiloAdapter, nhưng interface phải đủ rộng để Phase 4 plug Viettel/MISA mà không refactor core.

## Acceptance Criteria

- [ ] Interface `TVANAdapter` định nghĩa 8 method core
- [ ] Canonical Invoice model độc lập T-VAN
- [ ] HiloAdapter implement đầy đủ, mapping canonical ↔ Hilo format
- [ ] Token rotation tự động với Hilo OAuth
- [ ] Retry + circuit breaker wrapped quanh mọi adapter call
- [ ] Adapter health check `healthCheck()` ping Hilo sandbox endpoint
- [ ] Mock adapter cho test
- [ ] Unit test cho mapping logic (canonical → Hilo, Hilo → canonical)
- [ ] Integration test với Hilo sandbox (5 happy path + 5 error case)
- [ ] Documentation: how to add new adapter (vd: ViettelAdapter)

## Interface

```typescript
// packages/shared-types/src/tvan-adapter.ts

export interface TVANAdapter {
  readonly provider: 'hilo' | 'viettel' | 'misa' | string;

  /** Phát hành hóa đơn mới */
  issue(canonical: CanonicalInvoice, idempotencyKey: string): Promise<TVANResult>;

  /** Thay thế hóa đơn (NĐ 70/2025 thay cho hủy) */
  replace(originalTvanId: string, replacement: CanonicalInvoice): Promise<TVANResult>;

  /** Điều chỉnh hóa đơn (cộng/trừ) */
  adjust(originalTvanId: string, adjustment: AdjustmentSpec): Promise<TVANResult>;

  /** Tra cứu chi tiết */
  query(tvanId: string): Promise<CanonicalInvoice>;

  /** List + filter */
  list(filter: QueryFilter): Promise<{ items: CanonicalInvoice[]; total: number; cursor?: string }>;

  /** Download PDF */
  downloadPdf(tvanId: string): Promise<Buffer>;

  /** Download XML pháp lý */
  downloadXml(tvanId: string): Promise<string>;

  /** Sync inbound invoice */
  syncInbound(merchantConfig: MerchantTVANConfig, fromDate: Date): Promise<CanonicalInvoice[]>;

  /** Health check */
  healthCheck(): Promise<{ healthy: boolean; latencyMs: number; details?: Record<string, unknown> }>;
}

export interface TVANResult {
  success: boolean;
  tvanId?: string;
  cqtConfirmation?: { id: string; at: string };
  error?: { code: string; message: string; recoverable: boolean };
  raw?: unknown; // raw response for audit
}

export interface AdjustmentSpec {
  type: 'increase' | 'decrease';
  reason: string;
  items: Array<{ name: string; qty: number; unitPrice: number; taxRate: number }>;
}

export interface QueryFilter {
  merchantId: string;
  status?: CanonicalInvoice['status'][];
  fromDate?: Date;
  toDate?: Date;
  buyerMst?: string;
  page?: number;
  pageSize?: number;
}

export interface MerchantTVANConfig {
  merchantId: string;
  provider: string;
  credentials: { /* opaque, encrypted */ };
}
```

## Prompt cho AI

```
Implement TVANAdapter pattern cho Gateway service. Master Context §3
ràng buộc: KHÔNG reimplement T-VAN function của Hilo, KHÔNG lưu XML
gốc. Adapter chỉ gọi Hilo API.

Step-by-step:

1. Define `TVANAdapter` interface trong packages/shared-types như spec
   trên. Đầy đủ JSDoc cho mỗi method.

2. Create `apps/gateway/src/adapters/AdapterFactory.ts`:
   - Function getAdapter(provider, merchantConfig) trả về adapter instance
   - Singleton per (provider, merchantId) để reuse connection pool
   - Throw nếu provider chưa support

3. Implement `apps/gateway/src/adapters/hilo/HiloAdapter.ts`:
   - Constructor nhận merchantConfig (decrypted credential)
   - HTTP client (axios với keep-alive agent, timeout 25s)
   - Auth: OAuth 2.0 client credentials flow, cache access_token in
     Redis with TTL = expires_in - 60s. Auto-refresh trước khi expire.
   - Implement 9 method theo interface

4. Mapping layer `apps/gateway/src/adapters/hilo/mappers.ts`:
   - canonicalToHilo(canonical): convert CanonicalInvoice → Hilo schema
   - hiloToCanonical(hiloResp): reverse
   - QUAN TRỌNG: handle field discrepancies (vd: Hilo dùng field names
     riêng, format date khác, tax code khác). Document mỗi mapping với
     comment giải thích.
   - Edge case: missing optional fields, default values, enum mapping

5. Error mapping `apps/gateway/src/adapters/hilo/errors.ts`:
   - Map Hilo error code → TVANResult.error.code (canonical)
   - Determine recoverable (5xx + network = recoverable, 4xx = not)
   - Document mapping table

6. Mock adapter `apps/gateway/src/adapters/mock/MockAdapter.ts`:
   - Implement TVANAdapter với canned response
   - Configurable: success/error rate, latency
   - Dùng cho test không cần Hilo sandbox

7. Wrap adapter call với reliability:
   - Circuit breaker (cockatiel): 50% error rate trong 1m → open, 30s → half-open
   - Retry: exp backoff (1s, 2s, 4s, 8s), max 4, only 5xx + network
   - Timeout: 25s
   Implement helper function `executeWithReliability(adapter, method, args)`.

8. Unit tests:
   - Mapping correctness: canonical → Hilo → canonical roundtrip
   - Error mapping: 10 Hilo error codes → canonical
   - Token refresh logic: expired token triggers refresh
   - Circuit breaker behavior

9. Integration tests (chạy với Hilo sandbox, skip nếu credential không
   set):
   - Happy: issue, query, replace, adjust, downloadPdf, list, healthCheck
   - Error: invalid MST, invalid total, unauthorized, rate limited
   - Verify response shape match canonical

10. Documentation `docs/adapters/HOWTO_ADD_ADAPTER.md`:
    - Step-by-step add adapter mới (vd: ViettelAdapter)
    - Interface contract
    - Common pitfall (token format, date format, error mapping)
    - Test checklist

Critical notes:
- KHÔNG hardcode Hilo URL/credential. Dùng ENV var và config service.
- KHÔNG log raw Hilo response (có PII). Log redacted version cho audit.
- KHÔNG persist Hilo XML response trong Postgres. Chỉ lưu URL/ID trỏ Hilo.

Mark `// TODO` cho:
- Field mapping cụ thể nếu chưa có Hilo API spec đầy đủ → liên hệ
  Hilo team xác nhận
- Error code list nếu chưa documented
- Webhook handler từ Hilo (Phase 1 phụ thuộc Hilo có support webhook
  không, nếu không thì polling)
```

## Verification Checklist

- [ ] `pnpm test adapters/` pass, coverage ≥85%
- [ ] Integration test với Hilo sandbox: 5 happy path pass
- [ ] Mock adapter chạy được trong unit test mà không network
- [ ] Token rotation work: kill Redis cache, request mới trigger refresh
- [ ] Circuit breaker open khi sandbox return 5xx liên tục
- [ ] Documentation: 1 dev khác đọc xong tự add ViettelAdapter trong 1 ngày
- [ ] No raw Hilo XML / credential trong log output
