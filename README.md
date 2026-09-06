# 🛒 Price Tracker & E-Commerce Catalog Scraper Bot

Um robô automatizado de web scraping, monitoramento contínuo de preços e extração de catálogos e-commerce desenvolvido com **Node.js** e **Puppeteer**.

---

## 🚀 Funcionalidades Principais

- **Monitoramento Contínuo de Preços (`tracker.js`):**
  - Checagem automática e periódica em intervalos programados via polling assíncrono.
  - Alerta imediato no console assim que o preço atinge o gatilho financeiro estipulado.
  - Gerenciamento inteligente de instâncias e abas do navegador para otimização de memória RAM.

- **Extração Completa de Catálogos (`catalog_scraper.js`):**
  - Navegação automatizada multi-página (paginação dinâmica com identificação de link do botão *Next*).
  - Extração de múltiplos campos por produto: Título, Preço, Disponibilidade em estoque e Capa.
  - Pipeline de mídia automático: download assíncrono das imagens em pasta local dedicada (`imagens/`).
  - Exportação estruturada pronta para consumo: **JSON** estruturado e **CSV** otimizado para o Excel (UTF-8 com BOM e delimitadores corretos).

- **Evasão Anti-Bot & Camuflagem:**
  - Desativação da flag de controle de automação do Blink (`--disable-blink-features=AutomationControlled`).
  - Cabeçalhos de requisição e `User-Agent` reais simulando navegação humana em ambiente Desktop Windows.
  - Resolução de viewport padronizada (1920x1080).

- **Boas Práticas de Engenharia e Versionamento:**
  - Gerenciamento limpo com `.gitignore` (exclusão de binários, cache, mídias baixadas e `node_modules`).
  - Repositório enxuto e reprodutível.

---

## 🛠️ Tecnologias Utilizadas

- **Runtime:** Node.js
- **Automação Headless:** Puppeteer
- **Rede & Stream:** Node.js native `https` & `fs`
- **Controle de Versão:** Git & GitHub

---

## 📦 Como Instalar e Rodar

1. Clone o repositório:
```bash
git clone [https://github.com/timatghiass-tech/price-tracker-bot.git](https://github.com/timatghiass-tech/price-tracker-bot.git)
cd price-tracker-bot