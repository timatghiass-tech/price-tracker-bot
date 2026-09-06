const puppeteer = require('puppeteer');

// Configurações do monitor
const PRODUCT_URL = 'https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html';
const TARGET_PRICE = 52.00; // Preço alvo para alertar
const INTERVAL_SECONDS = 10; // Intervalo entre cada checagem (para teste rápido)

async function checkPrice(browser) {
  const page = await browser.newPage();

  // Camuflagem anti-bloqueio
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  try {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] Verificando preço...`);

    await page.goto(PRODUCT_URL, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const title = document.querySelector('h1')?.innerText || 'Produto';
      const priceText = document.querySelector('.price_color')?.innerText || '0';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      return { title, price };
    });

    console.log(`Produto: ${data.title}`);
    console.log(`Preço atual: £${data.price} | Meta: £${TARGET_PRICE}`);

    if (data.price <= TARGET_PRICE) {
      console.log(`\n🚨 OPORTUNIDADE ENCONTRADA! O preço atingiu £${data.price}! 🚨\n`);
    } else {
      console.log('Preço acima da meta. Continuando o monitoramento...\n');
    }
  } catch (error) {
    console.error('Erro na verificação:', error.message);
  } finally {
    await page.close(); // Fecha a aba para poupar memória RAM
  }
}

async function startMonitor() {
  console.log('=== ROBÔ DE MONITORAMENTO ATIVADO ===');
  console.log(`Checando a cada ${INTERVAL_SECONDS} segundos. Pressione Ctrl + C para parar.\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  // Executa a primeira checagem de imediato
  await checkPrice(browser);

  // Mantém o robô rodando no intervalo definido
  setInterval(async () => {
    await checkPrice(browser);
  }, INTERVAL_SECONDS * 1000);
}

startMonitor();
