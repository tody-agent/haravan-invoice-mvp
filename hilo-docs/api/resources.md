---
title: "Resources API"
description: "API reference for Resources"
---

# Resources API

> **Quick Reference**
> - **Base URL**: `https://apitctn.hilo.com.vn`
> - **Auth**: Bearer Token
> - **Content-Type**: `application/json`

## Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/resources/filtertechvalleyangelnetwork` | Danh sách nhà tvan | ✅ |
| POST | `/api/resources/filtertaxauthority` | Danh sách chi cục thuế | ✅ |

---

## POST /api/resources/filtertechvalleyangelnetwork

Danh sách nhà tvan

### Request Body

- **TaxCode** (`string`): 
- **Address** (`string`): 
- **Email** (`string`): 
- **Phone** (`string`): 
- **Name** (`string`): 
- **FromDate** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
- **ToDate** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
- **PageSize** (`integer`):  (Ví dụ: `10`)
- **Page** (`integer`):  (Ví dụ: `0`)

### Responses

**200 OK**

- **Data** (`object`): 
  - **Data** (`array`): 
    - **TaxCode** (`string`): 
    - **Address** (`string`): 
    - **Email** (`string`): 
    - **Phone** (`string`): 
    - **Name** (`string`): 
  - **PageSize** (`integer`): 
  - **Page** (`integer`): 
  - **Total** (`integer`): 
- **StatusCode** (`integer`): 
- **Code** (`integer`):  (Ví dụ: `200`)
- **Error** (`string`):  (Ví dụ: `Thông báo khi thất bại`)
- **Information** (`string`):  (Ví dụ: `Thông báo khi thành công`)
- **Messages** (`array`): 
  - **Type** (`object`): 
    - **Value** (`integer`): 
    - **Name** (`string`): 
    - **Description** (`string`): 
  - **Messages** (`array`):  (Ví dụ: `['']`)
- **TraceIdentifier** (`string`):  (Ví dụ: `8000000a-0005-fb00-b63f-84710c7967bb`)

### Examples

<details>
<summary>cURL</summary>

```bash
curl -X POST "https://apitctn.hilo.com.vn/api/resources/filtertechvalleyangelnetwork" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

</details>

---

## POST /api/resources/filtertaxauthority

Danh sách chi cục thuế

### Request Body

- **Code** (`string`): 
- **ShortName** (`string`): 
- **FullName** (`string`): 
- **FromDate** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
- **ToDate** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
- **PageSize** (`integer`):  (Ví dụ: `10`)
- **Page** (`integer`):  (Ví dụ: `0`)

### Responses

**200 OK**

- **Data** (`object`): 
  - **Data** (`array`): 
    - **Code** (`string`): 
    - **ShortName** (`string`): 
    - **FullName** (`string`): 
  - **PageSize** (`integer`): 
  - **Page** (`integer`): 
  - **Total** (`integer`): 
- **StatusCode** (`integer`): 
- **Code** (`integer`):  (Ví dụ: `200`)
- **Error** (`string`):  (Ví dụ: `Thông báo khi thất bại`)
- **Information** (`string`):  (Ví dụ: `Thông báo khi thành công`)
- **Messages** (`array`): 
  - **Type** (`object`): 
    - **Value** (`integer`): 
    - **Name** (`string`): 
    - **Description** (`string`): 
  - **Messages** (`array`):  (Ví dụ: `['']`)
- **TraceIdentifier** (`string`):  (Ví dụ: `8000000a-0005-fb00-b63f-84710c7967bb`)

### Examples

<details>
<summary>cURL</summary>

```bash
curl -X POST "https://apitctn.hilo.com.vn/api/resources/filtertaxauthority" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

</details>

---

