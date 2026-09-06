const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to download images locally via Node streams
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      } else {
        reject(new Error(`Download failed: status ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

(async () => {
  // Ensure images directory exists
  const imagesDir = path.join(__dirname, 'imagens');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 1. Launch the browser suppressing automation flags
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled' // Suppress automation flag
    ]
  });

  const page = await browser.newPage();

  // 2. Set realistic desktop display resolution
  await page.setViewport({ width: 1920, height: 1080 });

  // 3. Set standard human-like User-Agent header
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  let currentPageUrl = 'https://books.toscrape.com/catalogue/page-1.html';
  const allBooks = [];
  let pageCount = 1;
  let itemIndex = 1;

  while (currentPageUrl && pageCount <= 2) {
    console.log(`\n--- Scraping page ${pageCount}: ${currentPageUrl} ---`);
    await page.goto(currentPageUrl, { waitUntil: 'domcontentloaded' });

    // Extract product information
    const booksOnPage = await page.evaluate(() => {
      const items = document.querySelectorAll('article.product_pod');
      return Array.from(items).map(el => {
        const title = el.querySelector('h3 a')?.getAttribute('title') || 'Untitled';
        const price = el.querySelector('.price_color')?.innerText?.trim() || '';
        const availability = el.querySelector('.availability')?.innerText?.trim() || '';
        const imgRelative = el.querySelector('.image_container img')?.getAttribute('src') || '';
        return { title, price, availability, imgRelative };
      });
    });

    // Process media downloads and URLs
    for (const book of booksOnPage) {
      const fullImgUrl = new URL(book.imgRelative, currentPageUrl).href;
      const filename = `produto_${String(itemIndex).padStart(3, '0')}.jpg`;
      const localFilePath = path.join(imagesDir, filename);

      try {
        await downloadImage(fullImgUrl, localFilePath);
      } catch (err) {
        console.error(`Image error on item ${itemIndex}:`, err.message);
      }

      allBooks.push({
        index: itemIndex,
        title: book.title,
        price: book.price,
        availability: book.availability,
        image_url: fullImgUrl,
        local_image: path.join('imagens', filename)
      });

      itemIndex++;
    }

    console.log(`Page ${pageCount} completed. Total: ${allBooks.length} products.`);

    // Handle pagination (Next button)
    const nextButtonHref = await page.evaluate(() => {
      const nextLink = document.querySelector('li.next a');
      return nextLink ? nextLink.getAttribute('href') : null;
    });

    if (nextButtonHref) {
      currentPageUrl = new URL(nextButtonHref, currentPageUrl).href;
      pageCount++;
    } else {
      currentPageUrl = null;
    }
  }

  // Save to JSON
  fs.writeFileSync('catalogo.json', JSON.stringify(allBooks, null, 2), 'utf-8');

  // Save to CSV (UTF-8 with BOM for Excel compatibility)
  const csvHeaders = '\uFEFFIndex;Title;Price;Availability;ImageURL;LocalImage\n';
  const csvRows = allBooks.map(b => 
    `"${b.index}";"${b.title.replace(/"/g, '""')}";"${b.price}";"${b.availability}";"${b.image_url}";"${b.local_image}"`
  ).join('\n');
  
  fs.writeFileSync('catalogo.csv', csvHeaders + csvRows, 'utf-8');

  console.log('\nProcess finished successfully! Files catalogo.json and catalogo.csv generated.');
  await browser.close();
})();


