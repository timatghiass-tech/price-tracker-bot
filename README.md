# 🛒 Price Tracker & E-Commerce Catalog Scraper Bot

An automated web scraping, continuous price monitoring, and e-commerce catalog extraction bot built with Node.js and Puppeteer.

---

## 🚀 Key Features

### Real-Time Price Monitoring (`tracker.js`)
* **Continuous Polling:** Automated periodic checks at configurable intervals using asynchronous polling.
* **Instant Threshold Alerts:** Immediate console triggers and logs as soon as the target price drop threshold is met.
* **Resource Optimization:** Efficient browser instance and tab management to minimize memory overhead.

### Full Catalog Extraction (`catalog_scraper.js`)
* **Dynamic Multi-Page Pagination:** Automated traversal across multiple pages handling dynamic "Next" page navigation.
* **Rich Data Parsing:** Extracts key product fields including Title, Price, Stock Availability, and Image URLs.
* **Automated Media Pipeline:** Asynchronous binary image streaming and downloads directly into a local directory (`imagens/`).
* **Structured Multi-Format Exports:** Generates ready-to-use structured JSON and Excel-ready CSV (encoded with UTF-8 BOM and standard delimiters).

### Anti-Bot Stealth & Evasion
* **Automation Flag Suppression:** Disables Blink automation indicators (`--disable-blink-features=AutomationControlled`).
* **Synthetic Browser Fingerprint:** Authentic Desktop Windows User-Agent and realistic request headers.
* **Standardized Viewport:** Preset 1920x1080 display resolution to emulate real human browsing.

### Engineering Standards & Version Control
* **Clean Repository Architecture:** Configured `.gitignore` isolating dependencies, downloaded media assets, and runtime artifacts.
* **Reproducible Deployment:** Lightweight, clean, and reliable codebase.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Browser Automation:** Puppeteer
* **Networking & Streams:** Native Node.js `https` & `fs`
* **Version Control:** Git & GitHub

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/timatghiass-tech/price-tracker-bot.git](https://github.com/timatghiass-tech/price-tracker-bot.git)
cd price-tracker-bot
