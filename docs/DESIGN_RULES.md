# 25 Quy Tắc Thiết Kế Video Microlearning

> Tài liệu chuẩn hóa cho pipeline sản xuất video. Mỗi quy tắc đã được kiểm chứng thực tế.

---

## A. Quy Tắc Thời Lượng (Duration)

### R01 ⚠️ Audio-First Duration (CRITICAL)
**Frame duration = audio duration + 2 giây buffer.**  
KHÔNG BAO GIỜ hardcode `durationInFrames`. Luôn chạy `build-durations.js` sau khi sinh audio.

> **Bài học thực tế:** Lần đầu hardcode 26s cho mỗi section, audio thực tế 30-33s → bị cắt 32 giây nội dung.

### R02 Tổng thời lượng 2-5 phút
Microlearning tối ưu 3-4 phút. Tối đa tuyệt đối 5 phút.

### R03 Zero Dead Time
0 giây lãng phí. Mỗi giây phải có nội dung audio hoặc visual animation.

### R04 Section Balance
- Mỗi section nội dung: 15-35 giây
- Quiz: 15-25 giây  
- Intro/Hook: 8-15 giây
- Recap/Outro: 20-30 giây

---

## B. Quy Tắc Nội Dung (Content)

### R05 Single Concept per Video
1 video = 1 khái niệm hoặc 1 kỹ năng cốt lõi. Không nhồi nhét.

### R06 3-7 Key Points (Miller's Law)
Tối thiểu 3, tối đa 7 đơn vị thông tin mới. Vượt quá = quá tải nhận thức.

### R07 Hook trong 5-8 giây đầu
Bắt đầu bằng câu hỏi, thống kê gây sốc, hoặc tình huống gần gũi (Attention Theory).

### R08 Tip/Mẹo thực tế mỗi section
Mỗi key point nên kết thúc bằng 1 mẹo áp dụng ngay.

### R09 Quiz bắt buộc
Ít nhất 1 câu quiz (Active Recall). Đặt sau nội dung chính, trước recap.

### R10 Recap ở phần kết
Visual recap tóm tắt các điểm chính, màu sắc đồng bộ heading (Forgetting Curve).

---

## C. Quy Tắc Thiết Kế (Visual)

### R11 Heading Color riêng biệt
Mỗi section chính 1 màu riêng → tăng phân biệt và ghi nhớ.

### R12 Dark Theme mặc định
Nền tối, chữ sáng. Giảm mỏi mắt khi xem trên mobile.

### R13 Font size tối thiểu 18pt
Text nhỏ nhất phải đọc được trên màn hình mobile (1080p vertical).

### R14 Portrait 1080×1920
Vertical video cho mobile-first. Tỉ lệ 9:16.

### R15 Glassmorphism Cards
Card nền kính mờ (`backdrop-filter: blur`), border subtle. Tạo chiều sâu hiện đại.

---

## D. Quy Tắc Audio

### R16 Vietnamese Neural Voice
Giọng `vi-VN-HoaiMyNeural` (nữ, mềm, tự nhiên).

### R17 English = American Accent
Giữ nguyên thuật ngữ tiếng Anh trong TTS text. Neural voice tự đọc American accent.

### R18 ⚠️ Pipeline bắt buộc (CRITICAL)
```
generate-tts.js → build-durations.js → render
```
Không bao giờ bỏ bước đo audio.

### R19 Pace tự nhiên
Không tăng tốc quá 1.1x. Ưu tiên tốc độ đọc tự nhiên.

---

## E. Quy Tắc Chuyển Tiếp (Transition)

### R20 Fade 0.5s giữa sections
TransitionSeries + fade(), 15 frames. Mượt, tự nhiên.

### R21 Không hard cut
Cấm cắt trực tiếp giữa 2 section. Luôn có transition animation.

### R22 Fade-out cuối video
2s cuối fade-to-black hoặc fade-to-logo.

---

## F. Quy Tắc Sư Phạm (Pedagogy)

### R23 Bloom Level Alignment
| Template | Bloom Level phù hợp |
|---|---|
| Concept Explainer | Remember, Understand |
| Step-by-Step | Apply |
| Comparison | Analyze |
| Case Study | Evaluate |
| Review/Recap | Remember |

### R24 Cognitive Load ≤ 7
Không quá 7 đơn vị thông tin mới trong 1 video (Miller's Law).

### R25 Spaced Repetition Cue
Recap colors phải khớp heading colors → tạo liên tưởng thị giác để hỗ trợ ghi nhớ.
