---
description: Tạo video microlearning từ content.json qua pipeline tự động E2E v2
---

# Pipeline Tạo Video (E2E Tự Động)

## Yêu cầu
- File content.json theo cấu trúc tại `docs/INPUT_SPECIFICATION.md`
- Node.js + npm đã cài

## Lệnh duy nhất

```bash
node scripts/pipeline.js data/samples/<ten-bai>.json
```

## Pipeline tự động 5 bước

```
content.json → ① Validate → ② TTS → ③ Durations → ④ Transform → ⑤ Render
```

1. **Validate** — kiểm tra sections, id, template
2. **TTS** — sinh audio từ nội dung sections (`generate-tts-generic.js`)
3. **Durations** — đo thời lượng audio (`build-durations-generic.js`)
4. **Transform** — chuyển content.json → Remotion props (`content-adapter.js`)
   - Tự bổ sung: audio path, duration, headingColor, lessonNumber, recapSteps, channelName
5. **Render** — gọi Remotion với `--props` → video.mp4

## Options

```bash
# Bỏ qua TTS (dùng audio đã có)
node scripts/pipeline.js data/samples/oop-concept.json --skip-tts

# Bỏ qua render (chỉ TTS + durations + transform)
node scripts/pipeline.js data/samples/oop-concept.json --skip-render

# Bỏ cả hai (chỉ transform)
node scripts/pipeline.js data/samples/oop-concept.json --skip-tts --skip-render
```

## Cấu trúc output

```
output/<lesson-slug>/
├── audio/          ← file MP3 từ TTS
├── images/         ← file ảnh (nếu có)
├── props.json      ← props đã transform cho Remotion
└── <slug>-v1.mp4   ← video final
```

## Content.json cần gì?

GV chỉ cần viết nội dung sư phạm. Pipeline tự bổ sung các yếu tố kỹ thuật.

### GV viết:
- `meta`: tên bài, môn, chương, GV
- `sections[]`: nội dung từng phần (hook, definition, example...)
- `style.theme`: chọn theme (tech-blue, business-gold...)

### Pipeline tự tính:
- Audio path + duration (từ TTS)
- headingColor (từ theme)
- lessonNumber (ghép từ meta)
- recapSteps (từ recap_points + theme colors)
- channelName (mặc định)

## Lưu ý
- Mỗi section PHẢI có field `id` duy nhất
- Xem chi tiết schema: `docs/INPUT_SPECIFICATION.md`
- Kiểm tra chất lượng: xem skill `/quality-check`
