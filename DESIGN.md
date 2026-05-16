# Haravan Invoice - Design System

Tài liệu này chứa Design System (Hệ thống thiết kế) được trích xuất từ bản Prototype của Haravan Invoice. Việc chuẩn hóa design tokens này giúp cho quá trình AI hoặc developer code giao diện (UI) sau này được đồng nhất, chuẩn xác (pixel-perfect) và tối ưu.

## 1. Màu sắc (Colors)

Hệ thống sử dụng tone màu xanh đặc trưng của Haravan làm màu chủ đạo (Primary), kết hợp cùng các màu nền (Surface) xám nhạt để tạo không gian sạch sẽ, hiện đại.

- **Primary:** `#0088ff` (Xanh Haravan) - Dùng cho nút bấm chính, border focus, link.
- **Surface / Background:** 
  - Nền ứng dụng: `#f4f6f8`
  - Nền Sidebar: `#eef1f5`
  - Nền Card/Content: `#ffffff`
- **Text:**
  - Tiêu đề / Chữ chính: `#1c2237`
  - Chữ phụ (Secondary): `#4a5267`
  - Chữ mờ (Muted): `#8a93a4`
- **Semantic (Trạng thái):**
  - Thành công (Success): `#1ba345`
  - Cảnh báo (Warning): `#f5a623`
  - Lỗi / Xóa (Danger): `#e94545`
  - Thông tin (Info): `#0ea5e9`

## 2. Font chữ (Typography)

Hệ thống ưu tiên sử dụng font `Inter` cho nội dung văn bản và `JetBrains Mono` cho các dữ liệu dạng số, mã (SKU, mã hóa đơn).

- **Font Sans-serif:** `Inter` (14px cơ bản)
- **Font Monospace:** `JetBrains Mono` (13px cho mã)
- **Kích thước:**
  - H1: 22px, font-weight 600
  - H2: 18px, font-weight 600
  - Body: 14px, font-weight 400 (500 cho in đậm)
  - Caption: 12px, font-weight 400

## 3. Khoảng cách (Spacing) & Layout

Sử dụng hệ thống lưới 8px cho khoảng cách (margin, padding).

- Base 1: 4px
- Base 2: 8px
- Base 3: 12px
- Base 4: 16px
- Base 5: 24px
- Base 6: 32px

## 4. Bo góc (Border Radius) & Đổ bóng (Shadows)

Mang lại cảm giác mềm mại với các góc bo tròn và bóng đổ nhẹ.

- **Radius:** Card/Box lớn (12px), Nút/Input (8px hoặc 6px), Badge (Pill - 999px).
- **Shadow:** Tập trung vào bóng đổ nhẹ hướng xuống dưới (`xs` và `sm`) tạo chiều sâu cho các thành phần nổi.

---

<!-- STITCH_TOKENS_START -->
{
  "version": "1.0",
  "name": "Haravan Invoice Design System",
  "colors": {
    "primary": {
      "DEFAULT": "#0088ff",
      "hover": "#0070d8",
      "active": "#005fb8",
      "soft": "#e8f1ff"
    },
    "surface": {
      "DEFAULT": "#ffffff",
      "hover": "#f8fafc",
      "elevated": "#ffffff",
      "soft": "#f7f9fc",
      "app": "#f4f6f8",
      "sidebar": "#eef1f5"
    },
    "text": {
      "primary": "#1c2237",
      "secondary": "#4a5267",
      "muted": "#8a93a4",
      "inverse": "#ffffff",
      "link": "#0088ff"
    },
    "border": {
      "DEFAULT": "#e5e8ec",
      "strong": "#d6dae0",
      "focus": "#0088ff",
      "table": "#edeff3"
    },
    "semantic": {
      "success": { "DEFAULT": "#1ba345", "hover": "#168a3a", "soft": "#e7f7ec" },
      "warning": { "DEFAULT": "#f5a623", "hover": "#d88c0e", "soft": "#fff4dd" },
      "danger": { "DEFAULT": "#e94545", "hover": "#cf2f2f", "soft": "#fdecec" },
      "info": { "DEFAULT": "#0ea5e9", "soft": "#e0f2fe" },
      "purple": { "DEFAULT": "#7c3aed", "soft": "#f1edff" }
    }
  },
  "typography": {
    "fonts": {
      "sans": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "mono": "'JetBrains Mono', 'SF Mono', Monaco, Menlo, Consolas, monospace"
    },
    "scale": {
      "display": { "fontSize": "32px", "lineHeight": "40px", "fontWeight": "700" },
      "h1": { "fontSize": "22px", "lineHeight": "30px", "fontWeight": "600" },
      "h2": { "fontSize": "18px", "lineHeight": "26px", "fontWeight": "600" },
      "h3": { "fontSize": "15px", "lineHeight": "22px", "fontWeight": "600" },
      "body": { "fontSize": "14px", "lineHeight": "20px", "fontWeight": "400" },
      "body-strong": { "fontSize": "14px", "lineHeight": "20px", "fontWeight": "500" },
      "caption": { "fontSize": "12px", "lineHeight": "16px", "fontWeight": "400" },
      "mono": { "fontSize": "13px", "lineHeight": "18px", "fontWeight": "500" }
    }
  },
  "spacing": {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "24px",
    "6": "32px",
    "7": "48px",
    "8": "64px"
  },
  "borderRadius": {
    "xs": "4px",
    "sm": "6px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "pill": "999px"
  },
  "shadows": {
    "xs": "0 1px 2px rgba(20, 30, 60, 0.04)",
    "sm": "0 1px 3px rgba(20, 30, 60, 0.06), 0 1px 2px rgba(20, 30, 60, 0.04)",
    "md": "0 4px 12px rgba(20, 30, 60, 0.08)",
    "lg": "0 12px 24px rgba(20, 30, 60, 0.12)",
    "focus": "0 0 0 3px rgba(0, 136, 255, 0.18)"
  }
}
<!-- STITCH_TOKENS_END -->
