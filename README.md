# Firulais

**Firulais** is a privacy-first web application designed to **parse, condense, and optimize IDS alert logs** (like those from **Snort**) for human-readable reporting. It supports **local LLM (Large Language Model)** processing for total offline privacy, ensuring your sensitive logs never leave your machine.

---

## Project Goal

Firulais was built with one clear mission in mind:  
**Generate insightful reports from your IDS alerts using local LLMs, all while ensuring your data stays private and never leaves your machine.**


Whether you're trying to understand your network's behavior or compress verbose logs into summaries, Firulais gives you the power of local LLM processing through a modern web interface.

---

## Tech Stack

- React + TypeScript
- Llama.cpp for local LLM inference
- Node.js + Vite
- LocalStorage for temporary session data
- Optional Vercel deployment for public demo use

---

## Quickstart

### Run Locally (for Full Privacy)

1. **Clone the project and install dependencies**
   ```bash
   git clone https://github.com/JoseRaul42/Firulais.git
   cd firulais
   npm install
   npm run dev
   ```

2. **Open the app**  
   Visit `http://localhost:8080` in your browser.

3. **Load data**
   - You can use your own Snort alert log file.
   - Or test with example data:
     - Go to the `src/Utils/ExampleData` folder.
     - Copy the content of an example file and paste it into the app interface.

4. **Clear data when done**
   - Open Developer Tools (F12)
   - Go to the "Application" tab → "Local Storage"
   - Right-click your app's URL and choose "Clear"

### Vercel Demo (Not Private)

A public demo is available at:

```
https://your-vercel-url.vercel.app
```

> For privacy reasons, use the local version to analyze real alert logs.

---

## Folder Structure

```
firulais/
├── node_modules/              # Project dependencies
├── public/                    # Static assets
├── src/Utils/ExampleData      # Source code and example IDS logs
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

## Summary

Firulais provides cybersecurity enthusiasts and security analysts with a private, easy-to-use tool for interpreting IDS logs. Run it locally to maintain full control over your data and generate meaningful insights—without relying on any third-party services.



