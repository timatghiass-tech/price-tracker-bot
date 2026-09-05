require('dotenv').config();
const puppeteer = require('puppeteer');

const TARGET_PRICE = 60.00;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

async function sendDiscordAlert(title, price, url) {
  const payload = {
    content: `🚨 **ALERTA DE PREÇO BAIXO!**\nO produto **${title}** está custando **£${price}** (Meta: £${TARGET_PRICE}).\nConfira aqui: ${url}`
  };

  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function checkPrice() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = 'https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html';
  await page.goto(url, { waitUntil: 'networkidle2' });

  const title = await page.$eval('h1', el => el.innerText);
  const priceRaw = await page.$eval('.price_color', el => el.innerText);
  const currentPrice = parseFloat(priceRaw.replace(/[^0-9.]/g, ''));

  console.log(`Produto: ${title} | Preço: £${currentPrice}`);

  if (currentPrice <= TARGET_PRICE) {
    console.log('Enviando alerta para o Discord...');
    await sendDiscordAlert(title, currentPrice, url);
    console.log('Alerta enviado com sucesso!');
  } else {
    console.log('Preço acima da meta. Nenhum alerta enviado.');
  }

  await browser.close();
}

checkPrice();
