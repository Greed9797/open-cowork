<p align="center">
  <img src="resources/logo.png" alt="Open Cowork Logo" width="280" />
</p>

<h1 align="center">Open Cowork — AI Agent Desktop App</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-blue" alt="Platform" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
  <img src="https://img.shields.io/badge/Electron-41.x-47848F?logo=electron" alt="Electron" />
  <img src="https://img.shields.io/badge/Node.js-22+-brightgreen" alt="Node.js" />
</p>

<p align="center">
  <a href="#installation">⬇️ Download</a> •
  <a href="#quick-start">🚀 Quick Start</a> •
  <a href="#features">✨ Features</a> •
  <a href="#skills">🧰 Skills</a> •
  <a href="#faq">❓ FAQ</a>
</p>

---

Open Cowork is a free, open-source AI agent desktop app for Windows and macOS. It wraps Claude, OpenAI, Gemini and other models into a user-friendly GUI — no coding required. Key capabilities: VM-level sandbox isolation (WSL2 on Windows, Lima on macOS), built-in Skills for generating PPTX, DOCX, XLSX and PDF, MCP integration for browsers and Notion, GUI automation via computer use, and remote control via Telegram.

---

## 📋 System Requirements

|                  | Windows                        | macOS                          |
| ---------------- | ------------------------------ | ------------------------------ |
| **OS**           | Windows 10 / 11 (64-bit)       | macOS 12 Monterey or later     |
| **Architecture** | x64                            | Apple Silicon (M1+)            |
| **RAM**          | 4 GB minimum, 8 GB recommended | 4 GB minimum, 8 GB recommended |
| **Disk**         | ~500 MB free                   | ~500 MB free                   |
| **Node.js**      | Not required (bundled)         | Not required (bundled)         |

> **Sandbox (optional but recommended):** WSL2 on Windows, Lima on macOS — see [Security Configuration](#security-configuration).

---

<a id="installation"></a>

## ⬇️ Download & Install

### macOS

**Step 1 — Download the DMG**

Go to the [Releases page](https://github.com/Greed9797/open-cowork/releases) and download `Open Cowork-<version>-mac-arm64.dmg`.

**Step 2 — Open the DMG**

Double-click the `.dmg` file. Drag **Open Cowork** to your **Applications** folder.

**Step 3 — Bypass Gatekeeper (first launch only)**

Because the app is not distributed through the Mac App Store, macOS will block it on first open. Fix:

1. Go to **System Settings → Privacy & Security**
2. Scroll down to the blocked app warning
3. Click **Open Anyway**

Or run once in Terminal to permanently allow:

```bash
xattr -d com.apple.quarantine /Applications/Open\ Cowork.app
```

---

### Windows

**Step 1 — Download the installer**

Go to the [Releases page](https://github.com/Greed9797/open-cowork/releases) and download `Open Cowork-<version>-win-x64.exe`.

**Step 2 — Run the installer**

Double-click the `.exe`. If Windows SmartScreen blocks it, click **More info → Run anyway**.

**Step 3 — Launch**

Open Cowork appears in Start Menu and Desktop. Launch it and proceed to [Quick Start](#quick-start).

---

### Build from Source

For developers who want to contribute or run a custom build:

```bash
# Requirements: Node.js 22+, npm 10+
git clone https://github.com/Greed9797/open-cowork.git
cd open-cowork
npm install
npm run rebuild     # rebuild native modules for Electron
npm run dev         # dev mode with hot-reload
npm run build       # build installer to /release
```

---

<a id="security-configuration"></a>

### 🔒 Security Configuration (Sandbox)

Open Cowork supports multi-level sandboxing to isolate AI operations from your host system:

| Level        | Platform | Technology | What it does                                  |
| ------------ | -------- | ---------- | --------------------------------------------- |
| **Basic**    | All      | Path Guard | AI file access restricted to workspace folder |
| **Enhanced** | Windows  | WSL2       | All commands run inside an isolated Linux VM  |
| **Enhanced** | macOS    | Lima       | All commands run inside an isolated Linux VM  |

**macOS — enable Lima sandbox (recommended):**

```bash
brew install lima
# Open Cowork will auto-detect Lima and create a 'claude-sandbox' VM
```

**Windows — enable WSL2 sandbox (recommended):**

Install WSL2 from Microsoft: [https://docs.microsoft.com/en-us/windows/wsl/install](https://docs.microsoft.com/en-us/windows/wsl/install)

Open Cowork auto-detects WSL2 — no extra configuration needed.

> If no VM is available, the app falls back to path-based restrictions only.

---

<a id="quick-start"></a>

## 🚀 Quick Start

### Step 1 — Get an API Key

You need an API key from an AI provider. Recommended options:

| Provider       | Where to get it                                         | Base URL                    | Best model                    |
| -------------- | ------------------------------------------------------- | --------------------------- | ----------------------------- |
| **Anthropic**  | [console.anthropic.com](https://console.anthropic.com/) | _(leave blank — default)_   | `claude-sonnet-4-6`           |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai/)                 | `https://openrouter.ai/api` | `anthropic/claude-sonnet-4-6` |

> OpenRouter lets you use multiple providers with a single key and offers pay-as-you-go billing.

### Step 2 — Configure the App

1. Open the app → click the **⚙️ Settings** icon (bottom left)
2. Paste your **API Key**
3. Set the **Base URL** if using OpenRouter (see table above)
4. Set the **Model** name
5. Click **Save**

### Step 3 — Choose a Workspace

Click **Select Workspace** and choose a folder. The AI can only read/write files inside this folder.

> Create a dedicated folder like `~/ai-workspace` — don't point it at your entire home directory.

### Step 4 — Start Working

Type a prompt and press Enter. Examples:

> "Summarize all PDF files in this folder into a single Word document."

> "Read sales_data.xlsx and create a PowerPoint with 5 slides showing key trends."

> "Organize the files in this folder into subfolders by type and date."

---

<a id="features"></a>

## ✨ Features

- **One-click install** — pre-built installers for Windows and macOS, no terminal needed
- **Multi-model support** — Claude, OpenAI-compatible APIs, Gemini, DeepSeek, Ollama (local)
- **Skills system** — built-in workflows for PPTX, DOCX, XLSX, PDF generation
- **MCP integration** — connect to browsers, Notion, and other desktop apps
- **GUI automation** — control desktop apps via computer use (recommended: Gemini Pro)
- **Remote control** — send commands via Telegram bot
- **VM-level sandbox** — WSL2 (Windows) and Lima (macOS) isolate all AI operations
- **Multimodal input** — drag & drop images and files directly into chat
- **Memory system** — AI remembers context across sessions
- **Scheduled tasks** — run recurring AI tasks on a schedule

---

## 🎬 Demos

### Folder Organization 📂

https://github.com/user-attachments/assets/dbeb0337-2d19-4b5d-a438-5220f2a87ca7

### Generate PPT from Files 📊

https://github.com/user-attachments/assets/30299ded-0260-468f-b11d-d282bb9c97f2

### Generate XLSX Spreadsheets 📉

https://github.com/user-attachments/assets/f57b9106-4b2c-4747-aecd-a07f78af5dfc

### GUI Automation 🖥

https://github.com/user-attachments/assets/75542c76-210f-414d-8182-1da988c148f2

---

<a id="skills"></a>

## 🧰 Skills Library

Skills are pre-built AI workflows. They live under `.claude/skills/` and can be loaded on demand.

| Skill           | What it does                                        |
| --------------- | --------------------------------------------------- |
| `pptx`          | Generate PowerPoint presentations from data or text |
| `docx`          | Create and edit Word documents                      |
| `pdf`           | Read, fill, and extract from PDF files              |
| `xlsx`          | Create and process Excel spreadsheets               |
| `skill-creator` | Build your own custom skills                        |

You can add custom skills by creating a folder under `.claude/skills/<name>/` with a `SKILL.md` describing the workflow.

---

## 🏗️ Architecture

```
open-cowork/
├── src/
│   ├── main/                    # Electron main process (Node.js)
│   │   ├── claude/              # Agent runner & AI SDK integration
│   │   ├── config/              # Settings & model configuration
│   │   ├── db/                  # SQLite persistence
│   │   ├── memory/              # Cross-session memory
│   │   ├── remote/              # Remote control (Telegram)
│   │   ├── sandbox/             # Path guard & VM bridge
│   │   ├── session/             # Session management
│   │   ├── skills/              # Skill loader
│   │   └── tools/               # Tool execution (file, web, shell)
│   ├── preload/                 # Electron context bridge
│   └── renderer/                # React + Tailwind UI
│       └── components/
│           ├── ChatView.tsx     # Main chat interface
│           ├── ConfigModal.tsx  # Settings dialog
│           ├── Sidebar.tsx      # Navigation
│           └── TracePanel.tsx   # AI reasoning trace
├── .claude/skills/              # Built-in skill definitions
├── resources/                   # Icons, binaries
├── electron-builder.yml         # Build config
└── package.json
```

---

<a id="faq"></a>

## ❓ FAQ

**Is Open Cowork free?**
Yes — MIT license, fully open source. You only pay for the AI model API (Anthropic, OpenRouter, etc.).

**Does it send my data anywhere?**
No. The app runs entirely on your machine. The only outbound traffic is your prompts going to the AI provider API you configured. No analytics, no telemetry, no third-party tracking.

**macOS shows "app is damaged" or blocks the app — what do I do?**
Run in Terminal: `xattr -d com.apple.quarantine /Applications/Open\ Cowork.app`

**What is the workspace folder?**
It's the folder the AI is allowed to read and write. Choose a dedicated folder — the AI cannot access files outside it.

**Can I use a local model (Ollama)?**
Yes. In Settings, set Base URL to `http://localhost:11434` and enter your Ollama model name. Make sure Ollama is running locally.

**How does the sandbox work?**
With WSL2 (Windows) or Lima (macOS) installed, all shell commands the AI runs execute inside an isolated Linux VM. Even if the AI makes a mistake, it cannot touch your host system files outside the workspace.

**What are Skills?**
Skills are pre-built AI workflows (PPTX, DOCX, XLSX, PDF). The AI loads them automatically when you describe a relevant task. You can also create your own skills.

**Does it work on Linux?**
Pre-built installers are Windows and macOS only. Linux users can build from source.

---

## 🛠️ Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit and push
4. Open a Pull Request

---

## 📄 License

MIT © Open Cowork Team
