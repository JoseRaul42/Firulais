# 🐾 Firulais

**Firulais** is a privacy-first web application designed to **parse, condense, and optimize IDS alert logs** (like those from **Snort**) for **readable reporting**. This app supports **local LLM (Large Language Model)** processing for **complete offline privacy** — ensuring your sensitive logs never leave your machine.

---

## 🚀 Project Goal

Firulais was built with one mission:  
**Make intrusion detection alerts easy to digest without compromising your privacy.**

Whether you're trying to understand your network's behavior or compress verbose logs into actionable summaries, Firulais gives you the power of local LLM processing through a modern web interface.

---

## 🛠 Tech Stack

- ⚛️ React (with TypeScript)
- 🧠 Node.js + Vite
- 🔐 LocalStorage for temporary log caching (you can clear it anytime)
- 🌐 Hosted with Vercel (demo only – see below)

---

## 📦 Features

- 🧾 Parses Snort alert logs
- 🧠 Summarizes content using local LLMs (no remote API calls)
- 📊 Groups and visualizes alerts for fast triage
- 🧪 Includes example data to try out instantly
- 🧼 Privacy-focused: no backend, no tracking, no upload

---

## 🧪 Demo Mode

You can try out Firulais on the [**Vercel-hosted version**](https://your-vercel-url.vercel.app) using the **example logs** found in the `ExampleData/` folder of this repo.

> 🧪 This version is for demonstration only — it is **not private** since it's hosted remotely.

---

## 🔐 Privacy Mode (Local)

To ensure full data privacy:

1. **Clone this repo** and run it locally:
   ```bash
   git clone https://github.com/your-username/firulais.git
   cd firulais
   npm install
   npm run dev
   ```

2. **Access the local web app** in your browser (usually at `http://localhost:5173`).
3. **Upload your own Snort alert log file**.
4. **Manually clear local storage** once done:
   - Open Dev Tools in your browser (F12)
   - Go to the **Application** tab
   - Under **Storage > Local Storage**, right-click your app's domain and choose **Clear**

---

## 📂 Folder Structure

```
firulais/
├── node_modules/              # Project dependencies
├── public/                    # Static assets
├── src/Utils/ExampleData      # Source code and Example data (React + TypeScript)
├── .gitignore
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```


---

## 🧠 Summary

Firulais gives security analysts a tool to **read and interpret IDS logs** easily, without giving up privacy.  
Run it locally, clear your data when done, and trust that your network logs never leave your system.

---

## 🐶 Why "Firulais"?

Because even the most loyal dog knows how to guard the house — and your data.

---

## 🤝 Contributions

Feel free to open issues, suggest improvements, or submit PRs. Privacy-forward tooling is a team effort!

---

## 📜 License

MIT © 2025

