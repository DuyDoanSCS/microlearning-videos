# 🎬 Microlearning Video Pipeline v2

> Hệ thống tạo video bài giảng microlearning tự động từ file nội dung JSON.
> GV chỉ cần viết nội dung sư phạm → chạy 1 lệnh → nhận video hoàn chỉnh.

---

## 📋 Mục Lục

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt trên máy mới](#-cài-đặt-trên-máy-mới)
- [Chạy Pipeline](#-chạy-pipeline)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Tạo bài học mới](#-tạo-bài-học-mới)
- [Themes](#-themes)
- [Troubleshooting](#-troubleshooting)

---

## 💻 Yêu Cầu Hệ Thống

| Phần mềm | Version | Mục đích |
|---|---|---|
| **Node.js** | >= 18.x | Runtime cho script và Remotion |
| **npm** | >= 9.x | Quản lý packages |
| **ffmpeg** | Mới nhất | Render video (Remotion cần) |
| **Git** | Tùy chọn | Quản lý phiên bản |

### Cài đặt yêu cầu

#### Windows
1. **Node.js**: Tải từ https://nodejs.org/ (chọn LTS)
2. **ffmpeg**: 
   - Tải từ https://www.gyan.dev/ffmpeg/builds/ (chọn `ffmpeg-release-essentials.zip`)
   - Giải nén vào `C:\ffmpeg`
   - Thêm `C:\ffmpeg\bin` vào PATH:
     ```
     Cài đặt → Tìm "environment" → Environment Variables → Path → Edit → New → C:\ffmpeg\bin
     ```
   - Kiểm tra: mở terminal mới và chạy `ffmpeg -version`

#### macOS
```bash
brew install node ffmpeg
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y nodejs npm ffmpeg
```

---

## 🚀 Cài Đặt Trên Máy Mới

### Bước 1: Giải nén

Giải nén file `microlearning-pipeline-v2.zip` vào thư mục bạn muốn:

```bash
# Ví dụ:
cd D:\Projects
# Giải nén ZIP vào thư mục microlearning-videos
```

### Bước 2: Cài đặt dependencies

```bash
cd microlearning-videos
npm install
```

> ⏱️ Quá trình này mất khoảng 2-5 phút (tải ~200MB packages).

### Bước 3: Kiểm tra cài đặt

```bash
# Kiểm tra Node.js
node --version
# Kết quả: v18.x trở lên

# Kiểm tra ffmpeg
ffmpeg -version
# Kết quả: ffmpeg version ...

# Kiểm tra Remotion
npx remotion --version
# Kết quả: remotion v4.x
```

### Bước 4: Test nhanh (không cần TTS)

```bash
node scripts/pipeline.js data/samples/oop-concept.json --skip-tts --skip-render
```

Kết quả mong đợi:
```
📋 Step 1: Đọc content.json... ✅
⏭️  Step 2: SKIP TTS
📏 Step 3: Đo audio durations... ✅
🔄 Step 4: Transform content → Remotion props... ✅
⏭️  Step 5: SKIP Render
✅ Pipeline v2 hoàn thành!
```

### Bước 5: Test đầy đủ (TTS + Render)

```bash
node scripts/pipeline.js data/samples/oop-concept.json
```

> ⏱️ TTS: ~30 giây | Render: ~5-8 phút (tùy cấu hình máy)
> Output: `output/oop-la-gi/oop-la-gi-v1.mp4`

---

## 🎬 Chạy Pipeline

### Lệnh cơ bản

```bash
node scripts/pipeline.js <đường-dẫn-content.json>
```

### Ví dụ

```bash
# Tạo video từ bài OOP
node scripts/pipeline.js data/samples/oop-concept.json

# Bỏ qua TTS (dùng audio đã có sẵn)
node scripts/pipeline.js data/samples/oop-concept.json --skip-tts

# Chỉ transform (không TTS, không render)
node scripts/pipeline.js data/samples/oop-concept.json --skip-tts --skip-render
```

### Pipeline chạy 5 bước tự động

```
① Validate → ② TTS → ③ Duration → ④ Transform → ⑤ Render
```

| Bước | Script | Chức năng |
|---|---|---|
| ① Validate | pipeline.js | Kiểm tra content.json hợp lệ |
| ② TTS | generate-tts-generic.js | Sinh giọng đọc từ nội dung |
| ③ Duration | build-durations-generic.js | Đo thời lượng audio |
| ④ Transform | content-adapter.js | Chuyển nội dung → Remotion props |
| ⑤ Render | remotion render | Render video MP4 |

### Output

```
output/<tên-bài>/
├── audio/          ← File MP3 từ TTS
├── images/         ← File ảnh (nếu có)
├── props.json      ← Remotion props (đã transform)
└── <tên>-v1.mp4    ← VIDEO FINAL
```

---

## 📁 Cấu Trúc Dự Án

```
microlearning-videos/
│
├── 📂 data/                     ← DỮ LIỆU ĐẦU VÀO
│   ├── samples/                 ← File content.json mẫu
│   │   └── oop-concept.json     ← Bài mẫu OOP
│   ├── themes/                  ← Theme giao diện
│   │   ├── tech-blue.json       ← IT, Lập trình
│   │   ├── business-gold.json   ← Quản trị, Marketing
│   │   ├── science-green.json   ← Khoa học, Y tế
│   │   ├── creative-purple.json ← Thiết kế, Ngôn ngữ
│   │   └── universal-dark.json  ← Đa năng (mặc định)
│   ├── rules/                   ← 25 quy tắc thiết kế
│   └── schemas/                 ← JSON schema validate
│
├── 📂 scripts/                  ← PIPELINE SCRIPTS
│   ├── pipeline.js              ← ⭐ Script chính (chạy cái này)
│   ├── content-adapter.js       ← Transform content → props
│   ├── generate-tts-generic.js  ← TTS tổng quát
│   └── build-durations-generic.js ← Đo duration audio
│
├── 📂 src/                      ← REMOTION SOURCE
│   ├── Root.tsx                 ← Đăng ký compositions
│   ├── compositions/
│   │   └── ConceptExplainerVideo.tsx  ← Template Concept Explainer
│   ├── components/              ← UI components
│   │   ├── concept-explainer/   ← Components cho concept template
│   │   ├── QuizCard.tsx         ← Component quiz
│   │   └── MicroOutro.tsx       ← Component kết thúc
│   ├── MicroLearningVideo.tsx   ← Template Step-by-Step
│   └── styles/theme.ts         ← Theme mặc định
│
├── 📂 docs/                     ← TÀI LIỆU
│   ├── INPUT_SPECIFICATION.md   ← Cấu trúc content.json
│   └── DESIGN_RULES.md         ← 25 quy tắc thiết kế
│
├── 📂 output/                   ← OUTPUT (tự tạo khi chạy)
│
├── 📂 .agent/                   ← AI SKILLS & WORKFLOWS
│   ├── skills/
│   │   └── create-video/SKILL.md
│   └── workflows/
│       └── render-concept.md
│
├── package.json                 ← Dependencies
├── remotion.config.ts           ← Cấu hình Remotion
└── tsconfig.json                ← TypeScript config
```

---

## 📝 Tạo Bài Học Mới

### Bước 1: Copy file mẫu

```bash
cp data/samples/oop-concept.json data/samples/bai-hoc-moi.json
```

### Bước 2: Sửa nội dung

Mở `bai-hoc-moi.json` và thay đổi:

```json
{
  "meta": {
    "course": "Tên môn học của bạn",
    "lesson": "Tên bài học",
    "lesson_number": 1,
    "chapter": "Chương X: ...",
    "instructor": "ThS. Tên GV"
  },
  
  "video_type": "concept_explainer",
  
  "sections": [
    {
      "id": "hook",
      "type": "hook",
      "hook_text": "Câu gây tò mò về bài học...",
      "hook_stat": "XX%",
      "title": "Tên bài",
      "subtitle": "Phụ đề",
      "emoji": "🤔"
    },
    {
      "id": "definition",
      "type": "definition",
      "term": "Thuật ngữ",
      "term_english": "English Term",
      "definition": "Định nghĩa...",
      "keywords": ["Từ khóa 1", "Từ khóa 2"]
    },
    {
      "id": "visual",
      "type": "visual",
      "analogy": "So sánh trực quan...",
      "content": "Nội dung minh họa chi tiết..."
    },
    {
      "id": "example",
      "type": "example",
      "title": "Ví dụ thực tế",
      "analogy": "Mô tả ngắn...",
      "content": "Chi tiết ví dụ..."
    },
    {
      "id": "application",
      "type": "application",
      "title": "Ứng dụng thực tế",
      "applications": [
        "Ứng dụng 1 — giải thích",
        "Ứng dụng 2 — giải thích"
      ]
    },
    {
      "id": "quiz",
      "type": "quiz",
      "question": "Câu hỏi trắc nghiệm?",
      "options": ["A", "B", "C", "D"],
      "correct": 1,
      "explanation": "Giải thích đáp án đúng"
    },
    {
      "id": "recap",
      "type": "recap",
      "recap_points": [
        "Điểm tóm tắt 1",
        "Điểm tóm tắt 2",
        "Điểm tóm tắt 3"
      ],
      "next_lesson": "Tên bài tiếp theo"
    }
  ],

  "style": {
    "theme": "tech-blue",
    "voice": "vi-VN-HoaiMyNeural",
    "pace": "normal"
  }
}
```

### Bước 3: Chạy Pipeline

```bash
node scripts/pipeline.js data/samples/bai-hoc-moi.json
```

### Lưu ý quan trọng

- ⚠️ Mỗi section **PHẢI** có field `id` duy nhất
- ⚠️ `correct` trong quiz là index (bắt đầu từ 0)
- ⚠️ `video_type` phải là `concept_explainer` hoặc `step_by_step`
- 📖 Xem chi tiết: `docs/INPUT_SPECIFICATION.md`

---

## 🎨 Themes

| Theme ID | Màu chủ đạo | Nhóm môn học |
|---|---|---|
| `tech-blue` | 🔵 Xanh dương | IT, Lập trình, Kỹ thuật |
| `business-gold` | 🟡 Vàng kim | Quản trị, Marketing, Kinh tế |
| `science-green` | 🟢 Xanh lục | Khoa học, Y tế, Sinh học |
| `creative-purple` | 🟣 Tím | Thiết kế, Ngôn ngữ, Nghệ thuật |
| `universal-dark` | ⚫ Tối đa năng | Mặc định cho mọi môn |

Chọn theme bằng cách đặt trong `style.theme`:
```json
"style": { "theme": "science-green" }
```

---

## 🎤 Giọng đọc TTS

| Voice ID | Giới tính | Ghi chú |
|---|---|---|
| `vi-VN-HoaiMyNeural` | Nữ | Mặc định, tự nhiên |
| `vi-VN-NamMinhNeural` | Nam | Giọng nam |

Chọn trong `style.voice`:
```json
"style": { "voice": "vi-VN-NamMinhNeural" }
```

---

## 🔧 Troubleshooting

### Lỗi "ffmpeg not found"
```bash
# Kiểm tra ffmpeg
ffmpeg -version

# Nếu chưa cài, xem phần "Yêu cầu hệ thống" ở trên
```

### Lỗi "Cannot find module"
```bash
# Cài lại dependencies
npm install
```

### Lỗi "Section thiếu id"
Mỗi section trong content.json phải có field `id`:
```json
{ "id": "hook", "type": "hook", ... }
```

### Render chậm
- Thời gian render bình thường: 5-10 phút cho video 3 phút
- Đóng các ứng dụng nặng để giải phóng RAM
- Remotion sẽ dùng đa luồng (4x mặc định)

### Xem preview trong Studio
```bash
npx remotion studio
```
Mở browser tại http://localhost:3000 → chọn `ConceptExplainerVideo`

---

## 📞 Hỗ Trợ

- 📖 Tài liệu: `docs/INPUT_SPECIFICATION.md`
- 📋 Quy tắc thiết kế: `docs/DESIGN_RULES.md`
- 🔧 Skills AI: `.agent/skills/create-video/SKILL.md`
- 🔄 Workflow: `.agent/workflows/render-concept.md`

---

## 📌 Quick Reference

```bash
# Tạo video hoàn chỉnh
node scripts/pipeline.js data/samples/oop-concept.json

# Chỉ TTS + transform (không render)
node scripts/pipeline.js data/samples/oop-concept.json --skip-render

# Xem preview
npx remotion studio
```
