---
name: create-video
description: Tạo video microlearning từ content.json. Pipeline E2E tự động: validate → TTS → duration → render.
---

# Skill: Tạo Video Microlearning

## Mục đích
Tạo video microlearning hoàn chỉnh từ file `content.json` đầu vào.

## Khi nào dùng
- Khi GV cung cấp nội dung bài học (content.json)
- Khi cần tạo video mới hoặc render lại sau chỉnh sửa

## Lệnh duy nhất

```bash
node scripts/pipeline.js <path-to-content.json>
```

Ví dụ:
```bash
node scripts/pipeline.js data/samples/oop-concept.json
```

## Cấu trúc content.json

Xem chi tiết: `docs/INPUT_SPECIFICATION.md`

### Bắt buộc:
```json
{
  "meta": { "lesson": "Tên bài", "course": "Tên môn" },
  "video_type": "concept_explainer",
  "sections": [
    { "id": "hook", "type": "hook", ... },
    { "id": "definition", "type": "definition", ... },
    ...
  ],
  "style": { "theme": "tech-blue" }
}
```

### Section phải có `id`:
Mỗi section phải có field `id` duy nhất. TTS sẽ tạo file `<id>.mp3`.

## Templates hiện có

| Video Type | Composition | Bloom Level |
|---|---|---|
| `concept_explainer` | `ConceptExplainerVideo` | Remember, Understand |
| `step_by_step` | `MicroLearningVideo` | Apply |

## Themes có sẵn

| Theme ID | Nhóm môn |
|---|---|
| `tech-blue` | IT, Lập trình |
| `business-gold` | Quản trị, Marketing |
| `science-green` | Khoa học, Y tế |
| `creative-purple` | Thiết kế, Ngôn ngữ |
| `universal-dark` | Đa năng (mặc định) |

## Output structure

```
output/<lesson-slug>/
├── audio/          ← file MP3 từ TTS
├── images/         ← file ảnh (nếu có)
└── <slug>-v1.mp4   ← video final
```

## 5 Quy tắc CRITICAL

1. **R01** Audio-First Duration — không hardcode frames
2. **R02** Tổng thời lượng 2-5 phút
3. **R05** 1 video = 1 khái niệm
4. **R14** Portrait 1080×1920
5. **R18** Pipeline bắt buộc: TTS → Measure → Render

Xem 25 quy tắc đầy đủ: `docs/DESIGN_RULES.md`
