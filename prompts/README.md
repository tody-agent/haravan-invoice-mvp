# Prompts — Chạy song song không conflict

## Hướng dẫn

Mỗi prompt là 1 task độc lập. Chạy đồng thời nhiều prompt cùng lúc, mỗi prompt trong 1 terminal/session riêng.

**Quy tắc:**
- Mỗi prompt chỉ tạo/sửa file riêng của nó
- Không sửa file của prompt khác
- `index.ts` và `App.tsx` — mỗi prompt thêm 1 dòng import + 1 dòng route, không conflict

---

## Index — 6 prompts

| # | Tên | Files touched | Có thể chạy với |
|---|-----|---------------|-----------------|
| 1 | Gộp đơn cuối ngày (TT 78) | `aggregate.ts`, `DailyAggregate.tsx` | 2, 3, 4, 5, 6 |
| 2 | Product Catalog | `products.ts`, `ProductList.tsx` | 1, 3, 4, 5, 6 |
| 3 | Dashboard Omnichannel | `analytics.ts`, `Analytics.tsx` | 1, 2, 4, 5, 6 |
| 4 | Customer Detail Enhancement | `customer-analytics.ts`, `CustomerDetail.tsx` | 1, 2, 3, 5, 6 |
| 5 | Settings Enhancement | `settings.ts`, `SettingsTemplates.tsx`, `SettingsAutomation.tsx`, `SettingsPlan.tsx` | 1, 2, 3, 4, 6 |
| 6 | Notification Center | `notifications.ts`, `Notifications.tsx` | 1, 2, 3, 4, 5 |

---

## Chạy 6 prompts đồng thời

```
Terminal 1: Prompt 1 — Gộp đơn
Terminal 2: Prompt 2 — Products
Terminal 3: Prompt 3 — Analytics
Terminal 4: Prompt 4 — Customer Detail
Terminal 5: Prompt 5 — Settings
Terminal 6: Prompt 6 — Notifications
```

Sau khi tất cả hoàn thành:
```bash
cd /Volumes/Data/Invoice
pnpm --filter @haravan/api test      # Expect: 60+ tests
pnpm --filter @haravan/portal typecheck  # Expect: 0 errors
pnpm --filter @haravan/portal build      # Expect: success
```

---

## File conflict matrix

| File | Prompt 1 | Prompt 2 | Prompt 3 | Prompt 4 | Prompt 5 | Prompt 6 |
|------|----------|----------|----------|----------|----------|----------|
| `routes/index.ts` | +1 line | +1 line | +1 line | +1 line | +1 line | +1 line |
| `index.ts` | +2 lines | +2 lines | +2 lines | +2 lines | +2 lines | +2 lines |
| `App.tsx` | +1 line | +1 line | 0 | 0 | 0 | 0 |

**Conflict risk:** LOW — mỗi prompt thêm import riêng, không sửa code của prompt khác.

**Merge strategy:** Nếu 2 prompt cùng sửa `routes/index.ts` hoặc `index.ts`, merge theo thứ tự: thêm import ở cuối danh sách import, thêm route ở cuối danh sách route.

---

## Verification checklist (sau khi merge tất cả)

- [ ] `pnpm --filter @haravan/api test` — tất cả pass
- [ ] `pnpm --filter @haravan/portal typecheck` — 0 errors
- [ ] `pnpm --filter @haravan/portal build` — success
- [ ] Mở `http://localhost:5173` — tất cả nav links hoạt động
- [ ] Dashboard: charts + top customers + top SKUs
- [ ] Products: list + search
- [ ] Analytics: channel distribution + drill-down
- [ ] Customer Detail: KPI cards + channel breakdown
- [ ] Settings: Templates + Automation + Plan
- [ ] Notifications: list + filter + mark as read
- [ ] Aggregate: gộp đơn + summary
