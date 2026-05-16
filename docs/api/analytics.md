---
title: 'API Analytics — Channel breakdown, top customers, top SKUs'
description: 'Tài liệu API Analytics: phân bổ kênh bán, top khách hàng và top sản phẩm.'
keywords: 'analytics API, channel breakdown, top customers, top SKUs, revenue analysis'
robots: 'index, follow'
---

# API Analytics

> Phân tích doanh thu: channel breakdown, top 20 customers, top 10 SKUs.

:::tip Tóm tắt
Analytics API có 3 endpoints: GET /analytics/channels (doanh thu theo kênh), /top-customers (top 20 KH), /top-skus (top 10 SP). Tất cả accept `?days=` param (default: 30). Xem [API Products, Reports, Analytics](./products.md) để biết chi tiết.
:::

## GET /api/v1/analytics/channels

Revenue grouped by channel (admin/pos/web/auto).

## GET /api/v1/analytics/top-customers

Top 20 customers by revenue.

## GET /api/v1/analytics/top-skus

Top 10 SKUs by quantity sold.

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Phân tích](../sop/analytics.md)
- [API Products](./products.md)
