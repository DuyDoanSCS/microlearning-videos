---
name: create-video
description: Tạo video microlearning từ content.json. Chạy toàn bộ pipeline E2E từ TTS đến render.
---

# Skill: Tạo Video Microlearning

## Mục đích
Tạo video microlearning hoàn chỉnh từ file `content.json` đầu vào. Pipeline tự động: validate → TTS → measure → render.

## Khi nào dùng
- Khi GV cung cấp nội dung bài học (content.json hoặc mega prompt)
- Khi cần tạo video mới cho 1 bài học
- Khi cần render lại video sau khi chỉnh sửa nội dung

## Templates hiện có

| Template | Video Type | Bloom Level | Composition |
|---|---|---|---|
| **Step-by-Step** | `step_by_step` | Apply | `MicroLearningVideo` |
| **Concept Explainer** | `concept_explainer` | Remember, Understand | `ConceptExplainerVideo` |

## Quy trình thực hiện

### Bước 1: Chuẩn bị content.json

File content.json phải tuân thủ schema: `data/schemas/content-schema.json`

Xem mẫu:
- Step-by-step: Bài "Viết Email" trong `src/MicroLearningVideo.tsx`
- Concept Explainer: `data/samples/oop-concept.json`

### Bước 2: Chọn Theme

Mỗi video cần 1 theme từ thư viện `data/themes/`:

| Theme ID | Nhóm môn | 
|---|---|
| `tech-blue` | IT, Lập trình, Mạng |
| `business-gold` | Quản trị, Marketing, Kế toán |
| `science-green` | Khoa học, Y tế, Sinh học |
| `creative-purple` | Thiết kế, Nghệ thuật, Ngôn ngữ |
| `universal-dark` | Đa năng (mặc định) |

Đề xuất theme dựa trên `meta.course` hoặc `style.theme` trong content.json.

### Bước 3: Tạo TTS Script

Với mỗi section trong content.json, viết script TTS tiếng Việt:
- Giọng: `vi-VN-HoaiMyNeural` (mặc định)
- Thuật ngữ tiếng Anh: giữ nguyên, neural voice đọc American accent
- Mỗi section = 1 file MP3 riêng

Script mẫu: `scripts/generate-tts-concept.js`

**Lệnh chạy:**
```bash
node scripts/generate-tts-concept.js
```

### Bước 4: Đo Audio Duration (BẮT BUỘC!)

> ⚠️ **CRITICAL RULE R01**: KHÔNG BAO GIỜ hardcode `durationInFrames`. 
> Luôn chạy bước này sau khi sinh audio.

**Lệnh chạy:**
```bash
node scripts/build-durations-concept.js
```

Output: `src/audioDurations-concept.json` — nguồn sự thật duy nhất cho thời lượng video.

### Bước 5: Preview (Tùy chọn)

```bash
npx remotion studio
```

Mở browser → chọn composition → xem trước.

### Bước 6: Render Video

```bash
npx remotion render ConceptExplainerVideo output/<ten-bai>/<ten-bai>-v1.mp4
```

### Bước 7: Kiểm tra chất lượng

Chạy skill `/quality-check` hoặc kiểm tra thủ công:
- [ ] Audio không bị cắt
- [ ] Tổng thời lượng 2-5 phút
- [ ] Không có dead time
- [ ] Mỗi section có nội dung

## 25 Quy tắc thiết kế

Xem đầy đủ: `docs/DESIGN_RULES.md` hoặc `data/rules/design-rules.json`

**5 quy tắc CRITICAL:**
1. **R01** Audio-First Duration — không hardcode frames
2. **R02** Tổng thời lượng 2-5 phút
3. **R05** 1 video = 1 khái niệm
4. **R14** Portrait 1080×1920
5. **R18** Pipeline bắt buộc: TTS → Measure → Render

## Ví dụ lệnh đầy đủ

```bash
# 1. TTS
node scripts/generate-tts-concept.js

# 2. Đo duration
node scripts/build-durations-concept.js

# 3. Render
npx remotion render ConceptExplainerVideo output/oop-concept/oop-la-gi-v1.mp4
```
