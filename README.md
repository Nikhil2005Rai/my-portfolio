# Software Engineering Portfolio - Nikhil Rai

A premium, high-contrast monochromatic portfolio built with Next.js 16 (App Router), styled with modular Vanilla CSS, and featuring smooth Framer Motion tab transitions.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Vanilla CSS Modules (Monochromatic design tokens)
- **Animations**: Framer Motion
- **Icons**: React Icons & Lucide React
- **Contact Form API**: Web3Forms (Securely configured via environment variables)

---

## 🛠️ Features

1. **Single Source of Truth**: All details (About, Skills, Projects, Achievements, Certifications) are dynamically configured inside a single JSON file at `src/data/portfolio.json`.
2. **Split Screen Layout**: Navigation sidebar fixed on the left (collapses to an overlay drawer on mobile), content rendering panel on the right.
3. **Micro-animations**: Snappy tab layout transitions and character-spacing hover effects on navigation links.
4. **Secure Environment Variables**: Private API keys (like the Web3Forms token) are stored in `.env.local` to prevent leaks to public repositories.

---

## 📦 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Nikhil2005Rai/my-portfolio.git
cd my-portfolio
npm install
```

### 2. Configure Environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
