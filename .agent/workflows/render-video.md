---
description: Pipeline render video microlearning với Remotion — Quy trình chuẩn đảm bảo audio không bị cắt
---

# Microlearning Video Render Pipeline

## Nguyên tắc vàng

> **KHÔNG BAO GIỜ hardcode `durationInFrames`.**
> Luôn đo audio thực tế → tính frames → cấp phát + buffer.

## Bài học rút ra (2026-03-29)

**Issue:** Tất cả 8 file audio bị cắt ngắn vì `durationInFrames` được hardcode (26s)
trong khi audio thực tế dài 29-33s. Tổng mất 32 giây nội dung.

**Nguyên nhân gốc:** Khi bổ sung nội dung TTS (tips, ví dụ...), audio dài hơn nhưng
`durationInFrames` không được cập nhật theo.

**Quy tắc:** Mỗi khi thay đổi nội dung TTS → PHẢI chạy lại pipeline đo audio.

## Quy trình chuẩn (5 bước)

### 1. Viết nội dung TTS
```bash
# Sửa scripts/generate-tts.js với nội dung mới
```

### 2. Sinh audio
```bash
node scripts/generate-tts.js
```

### 3. Đo audio → Tạo config duration ⚠️ QUAN TRỌNG
```bash
node scripts/build-durations.js
```
Script này sẽ:
- Đo thời lượng thực tế mỗi file MP3
- Thêm buffer (2s) cho animation
- Xuất file `src/audioDurations.json`
- In bảng so sánh để kiểm tra

### 4. Preview
```bash
npm run dev
```
Kiểm tra trong Remotion Studio:
- [ ] Audio đọc hết câu ở mỗi section
- [ ] Tip card xuất hiện đúng lúc
- [ ] Transition mượt giữa các section
- [ ] Không có dead time

### 5. Render
```bash
npx remotion render MicroLearningVideo output/<ten-bai>/ten-bai-v<version>.mp4
```

## Cấu trúc output
```
output/
├── viet-email/
│   ├── viet-email-v4.mp4
│   └── viet-email-v4-fixed.mp4
├── trinh-bay-hieu-qua/
│   └── ...
└── ky-nang-thuyet-trinh/
    └── ...
```

## Checklist trước khi render

- [ ] Đã chạy `generate-tts.js` (audio mới)
- [ ] Đã chạy `build-durations.js` (đo duration)
- [ ] `audioDurations.json` khớp với audio files
- [ ] `theme.ts` duration = tổng từ audioDurations
- [ ] Preview trong Studio: audio không bị cắt
