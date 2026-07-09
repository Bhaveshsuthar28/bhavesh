# SignalLab - Echo System Simulator

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![React](https://img.shields.io/badge/react-18.3-61dafb)

A modern web application for **real-time audio echo/delay processing** with interactive signal visualization. Process audio files, apply LTI (Linear Time-Invariant) echo effects, and visualize the results through multiple frequency and time-domain charts.

## 📋 Quick Navigation
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Audio Processing
- **Multi-format Support**: WAV, MP3, MP4, M4A, OGG, FLAC, AAC
- **Automatic Conversion**: Auto-converts formats to WAV
- **Echo/Delay System**: Configurable echo effects
  - Delay: 10-2000ms
  - Scaling Factor: 0.1-0.9
  - Echoes: 1-8 repetitions

### Real-time Visualization
- 📊 **Waveform Comparison** - Time-domain signal shape
- 📈 **Frequency Spectrum (FFT)** - Frequency analysis
- 📉 **Echo Decay Chart** - Amplitude reduction visualization
- 🎛️ **System Impulse Response** - System characteristics
- 🔊 **Audio Playback** - Compare original vs processed

### User Interface
- Dark theme with blue accents
- Responsive design (desktop & tablet)
- Real-time processing status
- Drag & drop file upload
- Clear error messages

---

## 🛠️ Tech Stack

**Frontend:** React 18.3 | Vite 5.2 | Tailwind CSS 3.4 | Recharts 2.15 | Axios 1.7  
**Backend:** FastAPI | Uvicorn 0.29 | NumPy 1.26 | SciPy 1.15 | Soundfile 0.13 | Pydub 0.25 | FFmpeg

---

## 📦 Prerequisites

**Required:**
- Python 3.10+ → [Download](https://www.python.org/)
- Node.js 16+ → [Download](https://nodejs.org/)
- FFmpeg → [Download](https://ffmpeg.org/download.html)

**Verify Installation:**
```bash
python --version      # 3.10+
node --version        # 16+
npm --version         # 7+
ffmpeg -version       # Should show version
```

---

## 🚀 Installation

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Install FFmpeg

**Windows (Easiest):**
```bash
winget install ffmpeg
# OR: choco install ffmpeg
# Then restart your computer
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg  # Debian/Ubuntu
sudo yum install ffmpeg      # CentOS/RHEL
```

---

## ⚡ Quick Start (2 Minutes)

### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
✅ See: `Application startup complete.`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ See: `➜  Local:   http://localhost:3000/`

### Open Browser
Visit: **http://localhost:3000**

---

## 📁 Project Structure
```
SignalLab/
├── backend/
│   ├── main.py              # FastAPI routes
│   ├── echo_processor.py    # Signal processing
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/      # React components
│   │   └── api/audioApi.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 📖 Usage Guide

### Step 1: Upload Audio
1. Click **"Audio Upload"** or drag & drop file
2. Supported: **WAV, MP3, MP4, M4A, OGG, FLAC, AAC**
3. Max: **20MB**

### Step 2: Adjust Parameters
- **Delay (ms)**: Time between echoes (Default: 300)
- **Scaling Factor**: Echo loudness (Default: 0.5)
- **Number of Echoes**: Repetitions (Default: 3)

### Step 3: Process
Click **"Process"** button and wait for results

### Step 4: Analyze
- View 4 visualization charts
- Play original vs processed audio
- Adjust and reprocess

---

## 🔌 API Reference

**Base URL:** `http://localhost:8000`

### Health Check
```http
GET /health
```

### Process Audio
```http
POST /process
```

**Form Data:**
- `file` (File) - Audio file
- `delay_ms` (10-2000) - Echo delay
- `scaling_factor` (0.1-0.9) - Echo volume
- `num_echoes` (1-8) - Number of echoes

**Example:**
```bash
curl -X POST http://localhost:8000/process \
  -F "file=@audio.mp3" \
  -F "delay_ms=300" \
  -F "scaling_factor=0.5" \
  -F "num_echoes=3"
```

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
```bash
# Make sure backend is running
python -m uvicorn main:app --reload --port 8000
```

### "Couldn't find ffmpeg"
1. Verify: `ffmpeg -version`
2. If not found, install FFmpeg (see Installation)
3. **Restart computer** after installation
4. Restart backend

### "Invalid audio file: [WinError 2]"
- FFmpeg not in PATH
- Follow FFmpeg installation steps
- Restart computer

### Frontend is slow
1. Open DevTools (F12)
2. Check Console for errors
3. Use file < 5MB for testing
4. Close DevTools (speeds up browser)

### Audio not playing
1. Check browser console (F12)
2. Verify backend is running
3. Try different browser
4. Refresh page (Ctrl+Shift+R)

---

## ⚙️ Performance Tips

✅ Use **WAV files** (no conversion)  
✅ Keep files **< 5MB**  
✅ Use modern browser  
✅ Close DevTools (F12)  
✅ Close other apps  

---

## 📝 Commands

**Backend:**
```bash
python -m uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
npm run dev       # Development
npm run build     # Production build
npm run preview   # Preview build
npm run lint      # Lint code
```

---

## 🆘 FAQ

**Q: Why is frontend slow but Postman is fast?**  
A: Charts take time to render. Check browser console timing.

**Q: Can I use files > 20MB?**  
A: No, max is 20MB. For best performance use < 5MB.

**Q: Does it work offline?**  
A: No, both services must run locally.

**Q: What's max delay?**  
A: 2000ms (2 seconds)

---

## 🎵 Algorithm

The system creates echo effect using:
```
output = input + scaling×input(delayed) + scaling²×input(2×delayed) + ...
```

Example: 300ms delay, 0.5 scaling, 3 echoes
- Echo 1: 300ms later, 50% volume
- Echo 2: 600ms later, 25% volume
- Echo 3: 900ms later, 12.5% volume

---

## 📊 Signal Processing Details

**Waveform Chart:** Time-domain signal visualization  
**FFT Chart:** Frequency component analysis  
**Echo Decay:** How echo amplitude decreases  
**Impulse Response:** System's response characteristics  

---

## 🔐 Security

**Development Mode:** Open CORS, no authentication  
**Production:** Add authentication, restrict CORS, enable HTTPS

---

🎵 **Ready to explore signal processing?**
