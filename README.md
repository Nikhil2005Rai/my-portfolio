# Software Engineering Portfolio - Nikhil Rai

A premium, high-contrast developer portfolio built with Next.js 16 (App Router), styled with modular Vanilla CSS, and featuring programmatic audio, retro gaming easter eggs, and stateful widgets.

---

## 🚀 Tech Stack

*   **Framework**: Next.js 16 (App Router, Turbopack)
*   **Styling**: Vanilla CSS Modules (Monochromatic design tokens with Cyberpunk themes)
*   **AI Integration**: Vercel AI SDK (with Gemini 1.5 edge streams)
*   **Animations**: Framer Motion & CSS keyframe matrices
*   **Sounds**: Web Audio API (programmatic 8-bit sound synthesis)
*   **Icons**: Lucide React & React Icons
*   **Contact API**: Web3Forms (Secure fallback routing)

---

## 🛠️ Premium Features

### 1. 🤖 bot_nik AI Assistant Chatbot
*   **Dynamic edge streams**: Injects your `portfolio.json` database into the LLM context to answer recruiters' questions.
*   **Agentic Client-Side Tools**:
    *   `navigateToTab`: Automatically triggers layout page switches upon voice prompts (e.g. *"Show me your projects"*).
    *   `downloadResume`: Opens your resume PDF.

### 2. 🐾 Desktop Virtual Pet (Neko Companion)
*   **Silky-Smooth Physics**: A `requestAnimationFrame` loop tracking cursor coordinates at **60 FPS** using React Refs (zero React re-render overhead).
*   **AI Chatbot Interaction**: If the mouse is idle for 6 seconds, Neko walks over, bats at the chatbot button (triggering a physical wobble shake), and falls asleep on it.
*   **Interactive sound**: Click Neko to pet it; it plays a custom Frequency Modulated (FM) low-frequency synthesized purr.
*   **CLI Modes**:
    *   `laser`: Spawns a glowing red laser dot at the cursor, dilates Neko's eyes, and doubles chase speed.
    *   `catnip`: Drives Neko dizzy, causing it to run in chaotic zigzags with spinning frames and floating spiral emojis.

### ⌨️ 3. Secret Konami Keyboard Cheat Code
*   Type **`↑` `↑` `↓` `↓` `←` `→` `←` `→` `b` `a`** on your keyboard (normalized for legacy browser keycodes like `Up`/`Down`).
*   **Cyberpunk transformation**: Morph the entire website into a hot-pink and cyan neon theme with Scanline grid overlays, neon Neko outlines, and play a programmatically generated 8-bit arpeggio melody. Press **`Escape`** or click the pill status indicator to exit.
*   **Scroll prevention**: Browser viewport scrolls are blocked *only* while you are entering the cheat code.

### 🐚 4. Developer CLI Terminal Console (`Ctrl + ~`)
*   Fully functional UNIX-like console running retro phosphor CRT monitors.
*   Supported commands:
    *   `about` / `skills` / `projects` - Print biography, category meshes, or projects.
    *   `theme <green | amber | classic>` - Toggle console color overlays.
    *   `neko <spawn | dismiss>` - Toggle the desktop companion.
    *   `laser` / `catnip` - Toggle Neko modes (use `laser off` or `catnip off` to disable).
    *   `matrix` - Enters screen-wide green rainfall matrix animations.
    *   `hack` - Triggers exploit code waterfalls with ASCII terminal art.
    *   `sudo rm -rf` - Simulated directory purge sequence (triggers glitch audio, screen vibrations, a mock wipeout page, and Rickrolls visitors).

### 🖥️ 5. In-Portfolio Live Browser previews (Iframes)
*   Replaces standard external links with mock glassmorphic browser windows.
*   Includes refresh, address bars, fullscreen toggling, and loading spinners.
*   Uses tailored sandbox configurations (`allow-top-navigation-by-user-activation`, `allow-storage-access-by-user-activation`) and an alert banner guiding users to escape iframe OAuth blockades if login is required.

### 📊 6. Custom SVG Data Charts
*   **Skills Pentagon Mesh**: Custom SVG trigonometry pentagon calculating vertices and mapping Langs, Frontend, Backend, DevOps, and Core CS stats with interactive cards.
*   **LeetCode Area Chart**: SVG area chart tracing competitive coding milestones with hover nodes.

### 📱 7. Responsive Mobile Layout
*   Hides console buttons, chatbot FABs, Neko, and bootloader animations on viewports under `768px` to preserve a clean, fast monochromatic resume.

---

## 📦 Getting Started

### 1. Configure Local Environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_key
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Install & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your site locally!
