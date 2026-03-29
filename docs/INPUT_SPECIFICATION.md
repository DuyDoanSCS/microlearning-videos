# Input Specification — Microlearning Video Pipeline v2

> Tài liệu mô tả cấu trúc dữ liệu đầu vào (content.json) cho Pipeline tạo video.
> **GV chỉ cần viết nội dung sư phạm — Pipeline tự bổ sung toàn bộ yếu tố kỹ thuật.**

---

## Tổng Quan

Pipeline nhận **1 đầu vào duy nhất**: file `content.json` chứa nội dung bài học.

```
content.json → Pipeline v2 → video.mp4
```

### GV viết (sư phạm) vs Pipeline tự tính (kỹ thuật)

| GV viết trong content.json | Pipeline tự bổ sung |
|---|---|
| hook_text, title, subtitle | audio path (từ TTS) |
| definition, keywords | duration/frames (từ đo audio) |
| analogy, content, example | headingColor (từ theme) |
| applications[] | lessonNumber (ghép từ meta) |
| question, options, correct | recapSteps (từ recap_points + theme) |
| recap_points, next_lesson | channelName, correctIndex |
| theme, voice | gradients, bgColors |

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

| Value | Template | Bloom Level | Trạng thái |
|---|---|---|---|
| `concept_explainer` | Hook → Def → Visual → Example → Apply → Quiz → Recap | Remember, Understand | ✅ Có sẵn |
| `step_by_step` | Intro → N bước → Quiz → Outro | Apply | ✅ Có sẵn |
| `comparison` | Intro → A → B → So sánh → Kết luận | Analyze | 🔜 Phát triển |
| `case_study` | Tình huống → Phân tích → Giải pháp → Bài học | Evaluate | 🔜 Phát triển |
| `review_recap` | Tổng quan → Flashcard → Quiz tổng hợp | Remember | 🔜 Phát triển |

### 3. `sections[]` — Các section nội dung

> ⚠️ **QUAN TRỌNG:** Mỗi section PHẢI có field `id` duy nhất. Pipeline dùng `id` để đặt tên file audio và mapping duration.

#### Hook (concept_explainer)
```json
{
  "id": "hook",
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
  "id": "definition",
  "type": "definition",
  "term": "OOP",
  "term_english": "Object-Oriented Programming",
  "definition": "Định nghĩa ngắn gọn...",
  "keywords": ["Đối tượng", "Lớp"]
}
```

#### Visual Explain
```json
{
  "id": "visual",
  "type": "visual",
  "analogy": "OOP giống như bản thiết kế nhà...",
  "content": "Chi tiết minh họa..."
}
```

#### Example
```json
{
  "id": "example",
  "type": "example",
  "title": "Ví dụ: ứng dụng Grab",
  "analogy": "Mô tả ngắn...",
  "content": "Chi tiết ví dụ..."
}
```

#### Application
```json
{
  "id": "application",
  "type": "application",
  "title": "Tại sao phải học OOP?",
  "applications": [
    "Lý do 1 — giải thích",
    "Lý do 2 — giải thích"
  ]
}
```

#### Quiz (tất cả templates)
```json
{
  "id": "quiz",
  "type": "quiz",
  "question": "Câu hỏi?",
  "options": ["A", "B", "C", "D"],
  "correct": 1,
  "explanation": "Giải thích đáp án"
}
```
> `correct` = index đáp án đúng (0-based). Pipeline tự rename thành `correctIndex`.

#### Recap
```json
{
  "id": "recap",
  "type": "recap",
  "recap_points": [
    "Điểm tóm tắt 1",
    "Điểm tóm tắt 2"
  ],
  "next_lesson": "Bài tiếp theo",
  "summary": "Tóm tắt ngắn (tùy chọn)"
}
```
> Pipeline tự sinh `recapSteps[]` với icon + color từ theme. GV không cần chỉ định.

### 4. `style` — Cấu hình giao diện

| Field | Default | Mô tả |
|---|---|---|
| `theme` | `"universal-dark"` | ID theme từ thư viện |
| `voice` | `"vi-VN-HoaiMyNeural"` | Giọng TTS |
| `pace` | `"normal"` | Tốc độ đọc |

### Themes có sẵn

| ID | Tên | Nhóm môn |
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

## Pipeline v2 Xử Lý

```
content.json → ① validate → ② TTS → ③ duration → ④ transform → ⑤ render → video.mp4
```

### Bước ④ Transform (content-adapter.js)

Đây là bước quan trọng nhất — chuyển content.json (ngôn ngữ GV) sang Remotion props (ngôn ngữ kỹ thuật):
- Map snake_case → camelCase
- Thêm audio path, duration cho mỗi section
- Thêm headingColor từ theme
- Ghép lessonNumber từ meta
- Transform recap_points → recapSteps (thêm icon + color)
- Output: `props.json` tại `output/<slug>/`

### Output

```
output/<slug>/
├── audio/         ← MP3 files
├── images/        ← ảnh (nếu có)
├── props.json     ← Remotion props
└── <slug>-v1.mp4  ← video final
```

### Lệnh chạy

```bash
node scripts/pipeline.js data/samples/oop-concept.json
```
