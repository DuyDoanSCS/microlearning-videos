---
name: create-video
description: Tạo video microlearning từ content.json. Pipeline E2E v2 tự động: validate → TTS → duration → transform → render.
---

# Skill: Tạo Video Microlearning

## Mục đích
Tạo video microlearning hoàn chỉnh từ file `content.json` đầu vào.
GV chỉ cần viết nội dung sư phạm — Pipeline tự xử lý toàn bộ kỹ thuật.

## Lệnh duy nhất

```bash
node scripts/pipeline.js <path-to-content.json>
```

Ví dụ:
```bash
node scripts/pipeline.js data/samples/oop-concept.json
```

## Pipeline v2 — 5 bước tự động

```
content.json → Validate → TTS → Duration → Transform → Render → video.mp4
```

| Bước | Script | Chức năng |
|---|---|---|
| ① Validate | pipeline.js | Kiểm tra sections, id, template |
| ② TTS | generate-tts-generic.js | Sinh audio từ nội dung |
| ③ Duration | build-durations-generic.js | Đo thời lượng audio |
| ④ Transform | content-adapter.js | Chuyển content → Remotion props |
| ⑤ Render | remotion --props | Render video |

## Content.json — GV viết gì?

### Cấu trúc tối thiểu:
```json
{
  "meta": {
    "lesson": "Tên bài học",
    "course": "Tên môn học",
    "chapter": "Chương X",
    "lesson_number": 1
  },
  "video_type": "concept_explainer",
  "sections": [
    { "id": "hook", "type": "hook", "hook_text": "...", "title": "..." },
    { "id": "definition", "type": "definition", "term": "...", "definition": "..." },
    { "id": "visual", "type": "visual", "analogy": "...", "content": "..." },
    { "id": "example", "type": "example", "analogy": "...", "content": "..." },
    { "id": "application", "type": "application", "title": "...", "applications": [...] },
    { "id": "quiz", "type": "quiz", "question": "...", "options": [...], "correct": 1 },
    { "id": "recap", "type": "recap", "recap_points": [...], "next_lesson": "..." }
  ],
  "style": { "theme": "tech-blue" }
}
```

### Pipeline tự bổ sung (GV KHÔNG cần viết):
- `audio` path, `duration` (frames)
- `headingColor` (từ theme)
- `lessonNumber` (ghép từ meta)
- `recapSteps` (từ recap_points + icon + theme colors)
- `channelName`, `correctIndex`

## Templates

| Video Type | Composition | Sections | Bloom Level |
|---|---|---|---|
| `concept_explainer` | ConceptExplainerVideo | hook→definition→visual→example→application→quiz→recap | Remember, Understand |
| `step_by_step` | MicroLearningVideo | intro→point1-5→quiz→outro | Apply |

## Themes

| Theme ID | Nhóm môn | Primary Color |
|---|---|---|
| `tech-blue` | IT, Lập trình | #3B82F6 |
| `business-gold` | Quản trị, Marketing | #F59E0B |
| `science-green` | Khoa học, Y tế | #10B981 |
| `creative-purple` | Thiết kế, Ngôn ngữ | #8B5CF6 |
| `universal-dark` | Đa năng (mặc định) | #6366F1 |

## Output

```
output/<lesson-slug>/
├── audio/          ← MP3 files
├── images/         ← ảnh (nếu có)
├── props.json      ← Remotion props (đã transform)
└── <slug>-v1.mp4   ← video final
```

## 5 Quy tắc CRITICAL

1. **R01** Audio-First Duration — duration = audio length + 2s buffer
2. **R02** Tổng thời lượng 2-5 phút
3. **R05** 1 video = 1 khái niệm
4. **R14** Portrait 1080×1920
5. **R18** Pipeline: TTS → Measure → Transform → Render

Xem 25 quy tắc đầy đủ: `docs/DESIGN_RULES.md`
