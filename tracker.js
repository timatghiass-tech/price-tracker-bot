const puppeteer = require('puppeteer');

// Monitor configuration
const PRODUCT_URL = 'https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html';
const TARGET_PRICE = 52.00; // Price threshold for trigger
const INTERVAL_SECONDS = 10; // Polling interval (seconds)

async function checkPrice(browser) {
  const page = await browser.newPage();

  // Anti-bot stealth headers
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  try {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] Checking price...`);

    await page.goto(PRODUCT_URL, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const title = document.querySelector('h1')?.innerText || 'Product';
      const priceText = document.querySelector('.price_color')?.innerText || '0';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      return { title, price };
    });

    console.log(`Product: ${data.title}`);
    console.log(`Current price: £${data.price} | Target: £${TARGET_PRICE}`);

    if (data.price <= TARGET_PRICE) {
      console.log(`\n🚨 PRICE DROP ALERT! Price reached £${data.price}! 🚨\n`);
    } else {
      console.log('Price is above target. Continuing to monitor...\n');
    }
  } catch (error) {
    console.error('Error checking price:', error.message);
  } finally {
    await page.close(); // Free RAM
  }
}

async function startMonitor() {
  console.log('=== REAL-TIME PRICE MONITORING BOT ACTIVATED ===');
  console.log(`Polling every ${INTERVAL_SECONDS} seconds. Press Ctrl + C to stop.\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  // Initial check
  await checkPrice(browser);

  // Polling loop
  setInterval(async () => {
    await checkPrice(browser);
  }, INTERVAL_SECONDS * 1000);
}

startMonitor();