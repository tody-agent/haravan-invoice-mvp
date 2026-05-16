---
title: "Authentication API"
description: "API reference for Authentication"
---

# Authentication API

> **Quick Reference**
> - **Base URL**: `https://apitctn.hilo.com.vn`
> - **Auth**: Bearer Token
> - **Content-Type**: `application/json`

## Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/authentication/gettoken` | Lấy thông tin token | ✅ |

---

## POST /api/authentication/gettoken

Lấy thông tin token

### Request Body

- **TaxCode** (`string`):  (Ví dụ: `0106713804`)
- **UserName** (`string`):  (Ví dụ: `test`)
- **Password** (`string`):  (Ví dụ: `test`)

### Responses

**200 OK**

- **Data** (`object`): 
  - **accessToken** (`string`): 
  - **tokenType** (`string`): 
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
curl -X POST "https://apitctn.hilo.com.vn/api/authentication/gettoken" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

</details>

---

