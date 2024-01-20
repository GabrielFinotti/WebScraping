const puppeteer = require("puppeteer");
const url = "https://mercadolivre.com.br/";
const searchFor = "notebook";

let cont = 1;

const list = [];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector("#cb1-edit");
  await page.type("#cb1-edit", searchFor);
  await Promise.all([page.waitForNavigation(), page.click(".nav-search-btn")]);

  const links = await page.$$eval(".ui-search-item__group > a", (e1) =>
    e1.map((link) => link.href)
  );

  for (const link of links) {
    console.log(`Estou na página ${cont}`);
    if (cont == 4) continue;
    await page.goto(link);
    await page.waitForSelector(".ui-pdp-title");
    const title = await page.$eval(
      ".ui-pdp-title",
      (element) => element.innerHTML
    );
    const price = await page.$eval(
      ".andes-money-amount__fraction",
      (element) => element.innerHTML
    );

    const seller = await page.evaluate(() => {
      const e1 = document.querySelector(
        ".ui-pdp-seller__header__image-container__image"
      );
      if (!e1) return null;
      return e1.alt;
    });

    const mysearch = [];
    mysearch.title = title;
    mysearch.price = price;
    mysearch.link = link;
    seller ? (mysearch.seller = seller) : "";

    list.push(mysearch);

    cont++;
  }

  console.log(list);
  await browser.close();
})();
