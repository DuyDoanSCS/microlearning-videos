---
description: Tạo video Concept Explainer từ content.json qua pipeline E2E
---

# Pipeline Tạo Video Concept Explainer

## Yêu cầu
- File `data/samples/oop-concept.json` hoặc content.json tương tự
- Node.js + npm đã cài

## Các bước

// turbo-all

1. Sinh audio TTS
```bash
node scripts/generate-tts-concept.js
```

2. Đo thời lượng audio → tạo audioDurations
```bash
node scripts/build-durations-concept.js
```

3. Preview (tùy chọn)
```bash
npx remotion studio
```

4. Render video
```bash
npx remotion render ConceptExplainerVideo output/oop-concept/oop-la-gi-v1.mp4
```

## Lưu ý
- **KHÔNG bỏ bước 2** (build-durations). Đây là quy tắc R01 - Audio-First Duration.
- Khi đổi nội dung TTS → phải chạy lại từ bước 1.
- Kiểm tra video sau render: xem `/quality-check` skill.
