# 🛒 Price Tracker & E-Commerce Catalog Scraper Bot

Um robô automatizado de web scraping, monitoramento contínuo de preços e extração de catálogos e-commerce desenvolvido com **Node.js** e **Puppeteer**.

---

## 🚀 Funcionalidades Principais

- **Monitoramento Contínuo de Preços (`tracker.js`):**[cite: 1]
  - Checagem automática e periódica em intervalos programados via polling assíncrono[cite: 1].
  - Alerta imediato no console assim que o preço atinge o gatilho financeiro estipulado[cite: 1].
  - Gerenciamento inteligente de instâncias e abas do navegador para otimização de memória RAM[cite: 1].

- **Extração Completa de Catálogos (`catalog_scraper.js`):**[cite: 1]
  - Navegação automatizada multi-página (paginação dinâmica com identificação de link do botão *Next*)[cite: 1].
  - Extração de múltiplos campos por produto: Título, Preço, Disponibilidade em estoque e Capa[cite: 1].
  - Pipeline de mídia automático: download assíncrono das imagens em pasta local dedicada (`imagens/`)[cite: 1].
  - Exportação estruturada pronta para consumo: **JSON** estruturado e **CSV** otimizado para o Excel (UTF-8 com BOM e delimitadores corretos)[cite: 1].

- **Evasão Anti-Bot & Camuflagem:**[cite: 1]
  - Desativação da flag de controle de automação do Blink (`--disable-blink-features=AutomationControlled`)[cite: 1].
  - Cabeçalhos de requisição e `User-Agent` reais simulando navegação humana em ambiente Desktop Windows[cite: 1].
  - Resolução de viewport padronizada (1920x1080)[cite: 1].

- **Boas Práticas de Engenharia e Versionamento:**[cite: 1]
  - Gerenciamento limpo com `.gitignore` (exclusão de binários, cache, mídias baixadas e `node_modules`)[cite: 1].
  - Repositório enxuto e reprodutível[cite: 1].

---

## 🛠️ Tecnologias Utilizadas[cite: 1]

- **Runtime:** Node.js[cite: 1]
- **Automação Headless:** Puppeteer[cite: 1]
- **Rede & Stream:** Node.js native `https` & `fs`[cite: 1]
- **Controle de Versão:** Git & GitHub[cite: 1]

---

## 📦 Como Instalar e Rodar[cite: 1]

1. Clone o repositório[cite: 1]:
```bash
git clone [https://github.com/timatghiass-tech/price-tracker-bot.git](https://github.com/timatghiass-tech/price-tracker-bot.git)
cd price-tracker-bot