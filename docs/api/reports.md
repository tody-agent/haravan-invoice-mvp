---
title: 'API Reports — Báo cáo summary và monthly'
description: 'Tài liệu API Reports: KPI summary và báo cáo hàng tháng.'
keywords: 'reports API, summary report, monthly report, KPI'
robots: 'index, follow'
---

# API Reports

> Báo cáo KPI summary và monthly invoice report.

:::tip Tóm tắt
Reports API có 2 endpoints: GET /reports/summary (KPI tổng quan) và GET /reports/monthly (chi tiết hóa đơn theo tháng). Xem [API Products, Reports, Analytics](./products.md) để biết chi tiết.
:::

## GET /api/v1/reports/summary

KPI summary: total issued, pending, error, revenue this/last month.

## GET /api/v1/reports/monthly

Chi tiết hóa đơn theo tháng: invoice list + summary (count, totalAmount, taxAmount).

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Báo cáo](../sop/reports.md)
- [API Products](./products.md)
