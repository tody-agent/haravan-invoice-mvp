---
title: "Einvoicesolution API"
description: "API reference for Einvoicesolution"
---

# Einvoicesolution API

> **Quick Reference**
> - **Base URL**: `https://apitctn.hilo.com.vn`
> - **Auth**: Bearer Token
> - **Content-Type**: `application/json`

## Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/einvoicesolution/send` | Tạo thông điệp gửi | ✅ |
| POST | `/api/einvoicesolution/sendpos` | Tạo thông điệp cho các loại thông điệp | ✅ |
| GET | `/api/einvoicesolution/get` | Lấy thông tin thông điệp đã gửi | ✅ |
| GET | `/api/einvoicesolution/getsuccess` | Lấy thông tin thông điệp đã gửi thành công | ✅ |

---

## POST /api/einvoicesolution/send

Tạo thông điệp gửi

### Request Body

- **PBan** (`string`): 
- **MNGui** (`string`): 
- **MNNhan** (`string`): 
- **MLTDiep** (`integer`): 
- **MTDiep** (`string`): 
- **MST** (`string`): 
- **SLuong** (`integer`): 
- **XmlData** (`array`): 
  - **Xml** (`string`): 

### Responses

**200 OK**

- **Data** (`object`): 
  - **Id** (`string`):  (Ví dụ: `00000000000000000000000000000000`)
  - **PBan** (`string`): 
  - **MNGui** (`string`): 
  - **MNNhan** (`string`): 
  - **MLTDiep** (`integer`): 
  - **MTDiep** (`string`): 
  - **MST** (`string`): 
  - **SLuong** (`integer`): 
  - **MNGuiTN** (`string`): 
  - **MNNhanTN** (`string`): 
  - **MTDiepTN** (`string`): 
  - **TGNhan** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
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
curl -X POST "https://apitctn.hilo.com.vn/api/einvoicesolution/send" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

</details>

---

## POST /api/einvoicesolution/sendpos

Tạo thông điệp cho các loại thông điệp

### Request Body

- **Xml** (`string`): 

### Responses

**200 OK**

- **Data** (`object`): 
  - **Id** (`string`):  (Ví dụ: `00000000000000000000000000000000`)
  - **PBan** (`string`): 
  - **MNGui** (`string`): 
  - **MNNhan** (`string`): 
  - **MLTDiep** (`integer`): 
  - **MTDiep** (`string`): 
  - **MST** (`string`): 
  - **SLuong** (`integer`): 
  - **MNGuiTN** (`string`): 
  - **MNNhanTN** (`string`): 
  - **MTDiepTN** (`string`): 
  - **TGNhan** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
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
curl -X POST "https://apitctn.hilo.com.vn/api/einvoicesolution/sendpos" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

</details>

---

## GET /api/einvoicesolution/get

Lấy thông tin thông điệp đã gửi

### Parameters

| Name | Location | Type | Required | Default | Description |
|------|----------|------|----------|---------|-------------|
| MTDiep | query | string | ❌ | |  |
| MTDiepTN | query | string | ❌ | |  |

### Responses

**200 OK**

- **Data** (`object`): 
  - **Id** (`string`):  (Ví dụ: `00000000000000000000000000000000`)
  - **MTDiep** (`string`): 
  - **MTDTChieu** (`string`): 
  - **MLTDiep** (`integer`): 
  - **MNGui** (`string`): 
  - **MNNhan** (`string`): 
  - **MNGuiTN** (`string`): 
  - **MNNhanTN** (`string`): 
  - **TGNhan** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
  - **Response** (`array`): 
    - **MLTDiep** (`integer`): 
    - **Message** (`string`): 
    - **MTDiep** (`string`): 
    - **MTDiepTN** (`string`): 
    - **XmlReceiveTN** (`string`): 
    - **XmlReceive** (`string`): 
    - **Status** (`integer`): 
    - **CreateDate** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
    - **LastUpdateDate** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
    - **Order** (`integer`): 
    - **CurrentStatus** (`integer`): 
    - **Reason** (`array`): 
      - **MLoi** (`string`): 
      - **MTLoi** (`string`): 
      - **HDXLy** (`string`): 
      - **GChu** (`string`): 
    - **KafkaIn** (`object`): 
      - **Topic** (`string`): 
      - **Date** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
      - **Offset** (`number`): 
      - **Partition** (`integer`): 
    - **KafkaOut** (`object`): 
      - **Topic** (`string`): 
      - **Date** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
      - **Offset** (`number`): 
      - **Partition** (`integer`): 
    - **Id** (`string`):  (Ví dụ: `00000000000000000000000000000000`)
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
curl -X GET "https://apitctn.hilo.com.vn/api/einvoicesolution/get" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

</details>

---

## GET /api/einvoicesolution/getsuccess

Lấy thông tin thông điệp đã gửi thành công

### Parameters

| Name | Location | Type | Required | Default | Description |
|------|----------|------|----------|---------|-------------|
| MTDiep | query | string | ❌ | |  |
| MTDiepTN | query | string | ❌ | |  |
| MST | query | string | ❌ | |  |
| Serial | query | string | ❌ | |  |
| Pattern | query | string | ❌ | |  |
| No | query | integer | ❌ | |  |

### Responses

**200 OK**

- **Data** (`object`): 
  - **Id** (`string`):  (Ví dụ: `00000000000000000000000000000000`)
  - **MTDiep** (`string`): 
  - **MTDTChieu** (`string`): 
  - **MLTDiep** (`integer`): 
  - **MNGui** (`string`): 
  - **MNNhan** (`string`): 
  - **MNGuiTN** (`string`): 
  - **MNNhanTN** (`string`): 
  - **TGNhan** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
  - **Response** (`array`): 
    - **MLTDiep** (`integer`): 
    - **Message** (`string`): 
    - **MTDiep** (`string`): 
    - **MTDiepTN** (`string`): 
    - **XmlReceiveTN** (`string`): 
    - **XmlReceive** (`string`): 
    - **Status** (`integer`): 
    - **CreateDate** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
    - **LastUpdateDate** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
    - **Order** (`integer`): 
    - **CurrentStatus** (`integer`): 
    - **Reason** (`array`): 
      - **MLoi** (`string`): 
      - **MTLoi** (`string`): 
      - **HDXLy** (`string`): 
      - **GChu** (`string`): 
    - **KafkaIn** (`object`): 
      - **Topic** (`string`): 
      - **Date** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
      - **Offset** (`number`): 
      - **Partition** (`integer`): 
    - **KafkaOut** (`object`): 
      - **Topic** (`string`): 
      - **Date** (`string`):  (Ví dụ: `2026-05-15T19:04:44`)
      - **Offset** (`number`): 
      - **Partition** (`integer`): 
    - **Id** (`string`):  (Ví dụ: `00000000000000000000000000000000`)
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
curl -X GET "https://apitctn.hilo.com.vn/api/einvoicesolution/getsuccess" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

</details>

---

