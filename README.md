# 🚀 Bharanishwar P — Portfolio

> **AI & Full Stack Developer** | B.Tech Artificial Intelligence & Data Science | DSEC '27

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://bharanishwar-portfolio.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-bharani0207-orange?style=for-the-badge&logo=github)](https://github.com/bharani0207/PF-01)

---

## ✨ Features

- ⚡ **React (CDN)** — Component-based UI without a build step
- 🎨 **Tailwind CSS** — Utility-first styling with custom brand tokens
- 🌑 **HUD Profile Card** — Futuristic animated developer card with corner brackets & ambient light orbs
- 📊 **Skills & Projects** — Dynamic sections powered by a central `data.js` config
- 📬 **Contact Form** — Email delivery via FormSubmit.co
- 🔐 **Admin Panel** — Password-protected admin to update content live
- 📱 **Fully Responsive** — Mobile drawer nav, responsive grid layouts
- 🌐 **Deployed on Vercel** — Auto-served static site with serverless API

---

## 🗂️ Project Structure

```
PF-01/
├── index.html              # Entry point
├── css/
│   └── styles.css          # Custom CSS & animations
├── js/
│   ├── data.js             # All portfolio content (edit here!)
│   ├── App.js              # Root React app
│   └── components/
│       ├── Header.js       # Sticky navbar with BP logo
│       ├── Hero.js         # Landing hero section
│       ├── About.js        # HUD profile card + stats
│       ├── Skills.js       # Tech skills grid
│       ├── Projects.js     # Project cards
│       ├── Timeline.js     # Experience & education
│       ├── Contact.js      # Contact form
│       ├── Footer.js       # Footer
│       └── AdminPanel.js   # Admin dashboard
├── api/
│   └── upload.js           # Vercel serverless function
├── vercel.json             # Vercel deployment config
├── server.js               # Local dev server (port 8000)
├── bp_logo.png             # Brand logo / favicon
└── developer_avatar.png    # Profile photo
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (CDN) |
| Styling | Tailwind CSS + Vanilla CSS |
| Charts | Recharts |
| Database | Supabase |
| Email | FormSubmit.co |
| Hosting | Vercel |
| Fonts | Playfair Display, DM Sans, Caveat |
| Icons | Font Awesome 6 |

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/bharani0207/PF-01.git
cd PF-01

# Start the local server
node server.js

# Open in browser
# http://localhost:8000
```

---

## 📦 Deploy to Vercel

```bash
npx vercel --prod
```

---

## 📬 Contact

**Bharanishwar P**  
📧 bharanidinesh726@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/bharanishwar) · [GitHub](https://github.com/bharani0207)

---

<p align="center">Made with ❤️ by Bharanishwar P</p>
