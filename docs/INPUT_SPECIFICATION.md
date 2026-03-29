# Input Specification — Microlearning Video Pipeline

> Tài liệu mô tả cấu trúc dữ liệu đầu vào (content.json) cho Pipeline tạo video.

---

## Tổng Quan

Pipeline nhận **2 đầu vào** từ hệ thống Instructional Design:

1. **`content.json`** — Nội dung bài học cấu trúc hóa
2. **`mega_prompt`** (tùy chọn) — Hướng dẫn bổ sung cho AI

---

## Cấu Trúc content.json

### 1. `meta` — Thông tin môn học (bắt buộc)

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `course` | string | ✅ | Tên môn học |
| `course_code` | string | | Mã môn (ví dụ: SE201) |
| `lesson` | string | ✅ | Tên bài học |
| `lesson_number` | integer | | Số thứ tự bài |
| `chapter` | string | | Chương |
| `instructor` | string | | Giảng viên |
| `bloom_level` | enum | | remember/understand/apply/analyze/evaluate/create |
| `abet_outcome` | string | | Chuẩn ABET |
| `target_audience` | string | ✅ | Đối tượng SV |

### 2. `video_type` — Dạng video (bắt buộc)

| Value | Template | Bloom Level |
|---|---|---|
| `concept_explainer` | Hook → Def → Visual → Example → Apply → Quiz → Recap | Remember, Understand |
| `step_by_step` | Intro → N bước → Quiz → Outro | Apply |
| `comparison` | Intro → A → B → So sánh → Kết luận | Analyze |
| `case_study` | Tình huống → Phân tích → Giải pháp → Bài học | Evaluate |
| `review_recap` | Tổng quan → Flashcard → Quiz tổng hợp | Remember |

### 3. `sections[]` — Các section nội dung

#### Hook (concept_explainer)
```json
{
  "type": "hook",
  "emoji": "🤔",
  "hook_stat": "90%",
  "hook_text": "Câu gây tò mò...",
  "title": "Tên bài",
  "subtitle": "Phụ đề"
}
```

#### Definition
```json
{
  "type": "definition",
  "term": "OOP",
  "term_english": "Object-Oriented Programming",
  "definition": "Định nghĩa ngắn gọn...",
  "keywords": ["Đối tượng", "Lớp"]
}
```

#### Key Point (step_by_step)
```json
{
  "type": "key_point",
  "order": 1,
  "icon": "📌",
  "title": "Tiêu đề bước",
  "content": "Nội dung...",
  "example": "Ví dụ...",
  "tip": "Mẹo thực tế..."
}
```

#### Quiz (tất cả templates)
```json
{
  "type": "quiz",
  "question": "Câu hỏi?",
  "options": ["A", "B", "C", "D"],
  "correct": 1,
  "explanation": "Giải thích đáp án"
}
```

### 4. `style` — Cấu hình giao diện

| Field | Default | Mô tả |
|---|---|---|
| `theme` | `"universal-dark"` | ID theme từ thư viện |
| `voice` | `"vi-VN-HoaiMyNeural"` | Giọng TTS |
| `pace` | `"normal"` | Tốc độ đọc |

### Themes có sẵn

| ID | Tên | Nhóm |
|---|---|---|
| `tech-blue` | 🔵 Tech Blue | IT, Lập trình |
| `business-gold` | 🟡 Business Gold | Quản trị, Marketing |
| `science-green` | 🟢 Science Green | Khoa học, Y tế |
| `creative-purple` | 🟣 Creative Purple | Thiết kế, Ngôn ngữ |
| `universal-dark` | ⚫ Universal Dark | Đa năng (mặc định) |

---

## Ví Dụ Đầy Đủ

Xem: `data/samples/oop-concept.json`

---

## Pipeline Xử Lý

```
content.json → validate → generate-tts → build-durations → render → QA → output
```

### Output

- `output/<tên-bài>/<tên-bài>-v<version>.mp4` — Video MP4
- Metadata JSON kèm theo cho LMS import
