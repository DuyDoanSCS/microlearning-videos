---
description: Tạo video microlearning từ content.json qua pipeline tự động E2E
---

# Pipeline Tạo Video (Generic)

## Yêu cầu
- File content.json theo schema `data/schemas/content-schema.json`
- Node.js + npm đã cài

## Lệnh duy nhất

```bash
node scripts/pipeline.js data/samples/oop-concept.json
```

Pipeline tự động:
1. ✅ Đọc + validate content.json
2. ✅ Chọn theme từ `style.theme`
3. ✅ Chạy TTS (generic) → `output/<slug>/audio/`
4. ✅ Đo durations → `src/audioDurations-<slug>.json`
5. ✅ Render video → `output/<slug>/<slug>-v1.mp4`

## Options

```bash
# Bỏ qua TTS (dùng audio đã có)
node scripts/pipeline.js data/samples/oop-concept.json --skip-tts

# Bỏ qua render (chỉ TTS + durations)
node scripts/pipeline.js data/samples/oop-concept.json --skip-render
```

## Cấu trúc output

```
output/<lesson-slug>/
├── audio/          ← file MP3 từ TTS
├── images/         ← file ảnh (nếu có)
└── <slug>-v1.mp4   ← video final
```

## Lưu ý
- Content.json PHẢI có `id` cho mỗi section
- Theme phải tồn tại trong `data/themes/<theme-id>.json`
- Kiểm tra video: xem skill `/quality-check`
