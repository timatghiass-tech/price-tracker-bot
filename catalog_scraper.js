const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Função auxiliar para baixar e salvar imagens locais
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const stream = fs.createWriteStream(filepath);
        res.pipe(stream);
        stream.on('finish', () => resolve(filepath));
      } else {
        reject(new Error(`Falha no download: status ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Função para exportar os dados em CSV (Excel)
function exportToCSV(data, filename) {
  const headers = ['ID', 'Titulo', 'Preco', 'Disponibilidade', 'Arquivo_Imagem'];
  const rows = data.map((item) => {
    const cleanTitle = `"${item.title.replace(/"/g, '""')}"`;
    return [item.id, cleanTitle, item.price, `"${item.availability}"`, `"${item.imageFile}"`].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
  fs.writeFileSync(filename, csvContent, 'utf-8');
}

async function scrapeFullCatalog() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Cria a pasta imagens/ se ela ainda não existir
  const imagesDir = path.join(__dirname, 'imagens');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }

  let currentPageUrl = 'https://books.toscrape.com/';
  const allBooks = [];
  const maxPages = 2; // Teste rápido em 2 páginas (40 produtos e 40 imagens baixadas)
  let pageCount = 1;

  while (currentPageUrl && pageCount <= maxPages) {
    console.log(`\n--- Raspando página ${pageCount}: ${currentPageUrl} ---`);
    await page.goto(currentPageUrl, { waitUntil: 'networkidle2' });

    // Coleta dados e o link da capa de cada produto
    const booksOnPage = await page.$$eval('.product_pod', (elements) => {
      return elements.map((el) => {
        const title = el.querySelector('h3 a')?.getAttribute('title') || 'Sem título';
        const priceRaw = el.querySelector('.price_color')?.innerText || '0';
        const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ''));
        const availability = el.querySelector('.availability')?.innerText.trim() || 'Desconhecido';
        const imgRelativeSrc = el.querySelector('.image_container img')?.getAttribute('src') || '';

        return { title, price, availability, imgRelativeSrc };
      });
    });

    // Baixa cada foto e vincula ao objeto do livro
    for (let i = 0; i < booksOnPage.length; i++) {
      const item = booksOnPage[i];
      const itemIndex = allBooks.length + 1;

      const imageUrl = new URL(item.imgRelativeSrc, page.url()).href;
      const fileName = `produto_${String(itemIndex).padStart(3, '0')}.jpg`;
      const localFilePath = path.join(imagesDir, fileName);

      try {
        await downloadImage(imageUrl, localFilePath);
      } catch (err) {
        console.error(`Erro ao baixar imagem do item ${itemIndex}:`, err.message);
      }

      allBooks.push({
        id: itemIndex,
        title: item.title,
        price: item.price,
        availability: item.availability,
        imageUrl: imageUrl,
        imageFile: `imagens/${fileName}`,
      });
    }

    console.log(`Página ${pageCount} concluída! Total até agora: ${allBooks.length} produtos.`);

    // Avança para a próxima página se houver
    const nextButton = await page.$('.pager .next a');
    if (nextButton) {
      const nextHref = await page.$eval('.pager .next a', (el) => el.getAttribute('href'));
      currentPageUrl = new URL(nextHref, page.url()).href;
      pageCount++;
    } else {
      currentPageUrl = null;
    }
  }

  console.log(`\nProcessamento finalizado! Total de itens: ${allBooks.length}`);

  // Salva arquivos locais
  fs.writeFileSync('produtos.json', JSON.stringify(allBooks, null, 2), 'utf-8');
  console.log('produtos.json atualizado.');

  exportToCSV(allBooks, 'produtos.csv');
  console.log('produtos.csv atualizado com os links locais das capas.');

  await browser.close();
}

scrapeFullCatalog();
