---
name: quality-check
description: Kiểm tra chất lượng video microlearning dựa trên 25 quy tắc thiết kế. Phát hiện dead time, audio cắt, nội dung thiếu.
---

# Skill: Kiểm Tra Chất Lượng Video

## Mục đích
Đảm bảo video microlearning đạt chuẩn chất lượng theo 25 quy tắc thiết kế đã định nghĩa.

## Khi nào dùng
- Sau khi render video xong
- Khi GV phản hồi có vấn đề về video
- Khi review video trước khi đưa lên LMS

## Checklist kiểm tra

### A. Duration (Thời lượng)

- [ ] **R01** Audio-First: Mỗi section có duration ≥ audio duration + 2s buffer?
  - Kiểm tra: so sánh `audioDurations.json` với `durationInFrames` trong composition
- [ ] **R02** Tổng thời lượng nằm trong 2-5 phút?
  - Kiểm tra: `_meta.totalDurationSeconds` trong audioDurations
- [ ] **R03** Zero Dead Time: Không có khoảng lặng > 2s giữa audio?
  - Kiểm tra: xem video, chú ý các đoạn "đứng hình"
- [ ] **R04** Section balance: Không section nào quá ngắn (<10s) hoặc quá dài (>40s)?

### B. Content (Nội dung)

- [ ] **R05** Video chỉ dạy 1 khái niệm/kỹ năng?
- [ ] **R06** Số key points/sections nội dung: 3-7?
- [ ] **R07** Hook/Intro trong 8s đầu có câu gây chú ý?
- [ ] **R09** Có ít nhất 1 câu quiz?
- [ ] **R10** Có recap/tóm tắt ở cuối?

### C. Visual (Thiết kế)

- [ ] **R11** Mỗi section có heading color riêng biệt?
- [ ] **R12** Dark theme: nền tối, chữ sáng?
- [ ] **R13** Font size nhỏ nhất ≥ 18pt (đọc được trên mobile)?
- [ ] **R14** Tỉ lệ 1080×1920 (portrait)?
- [ ] **R15** Card có glassmorphism effect?

### D. Audio

- [ ] **R16** Giọng đọc vi-VN-HoaiMyNeural?
- [ ] **R17** Thuật ngữ tiếng Anh đọc đúng American accent?
- [ ] **R18** Pipeline đã chạy đủ 3 bước (TTS → Measure → Render)?
- [ ] **R19** Tốc độ đọc tự nhiên (không quá nhanh)?

### E. Transition

- [ ] **R20** Fade 0.5s giữa các sections?
- [ ] **R21** Không có hard cut (cắt đột ngột)?
- [ ] **R22** Cuối video có fade-out?

### F. Pedagogy (Sư phạm)

- [ ] **R23** Template khớp Bloom level?
  - Concept Explainer → Remember/Understand
  - Step-by-Step → Apply
- [ ] **R24** Không quá 7 đơn vị thông tin mới?
- [ ] **R25** Recap colors khớp heading colors?

## Cách kiểm tra tự động

### Kiểm tra audio durations
```bash
# Xem audioDurations đã được sinh chưa
cat src/audioDurations-concept.json

# Xác nhận tổng thời lượng
node -e "const d=require('./src/audioDurations-concept.json'); console.log('Total:', d._meta.totalDurationSeconds + 's')"
```

### Kiểm tra file output
```bash
# Xác nhận video đã render
ls -la output/<ten-bai>/

# Kiểm tra kích thước (nên > 5MB cho video 3 phút)
```

### Kiểm tra nội dung TTS
```bash
# Đếm số file audio (= số sections)
ls public/audio/<lesson-folder>/
```

## Xử lý lỗi phổ biến

| Triệu chứng | Nguyên nhân | Giải pháp |
|---|---|---|
| Audio bị cắt giữa chừng | Hardcode duration < audio thực tế | Chạy lại `build-durations` |
| Dead time dài (> 2s) | Buffer quá lớn hoặc section trống | Giảm buffer xuống 1.5s hoặc thêm content |
| Video quá dài (> 5 phút) | Quá nhiều nội dung/sections | Tách thành 2 video |
| Transition giật | Thiếu `TransitionSeries` | Dùng fade() với 15 frames |
| Heading cùng màu | Thiếu `headingColors` array | Kiểm tra theme có đủ 7 colors |

## Báo cáo chất lượng

Sau khi kiểm tra, tạo báo cáo:

```
✅ PASS / ❌ FAIL: [Tên bài]
- Duration: X phút Y giây (OK/WARNING)
- Sections: N sections (OK)
- Dead time: X giây (OK/FAIL)
- Audio: Không bị cắt (OK/FAIL)
- Quiz: Có (OK/FAIL)
- Recap: Có (OK/FAIL)
```
