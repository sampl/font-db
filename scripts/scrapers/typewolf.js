const puppeteer = require("puppeteer");

async function getAllTypeWolfFontSlugs() {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto("https://www.typewolf.com/all-fonts", {
      waitUntil: "domcontentloaded",
    });

    // Use a Set to avoid duplicates
    const slugs = new Set();

    await page.waitForSelector(".tag-collection");

    const data = await page.evaluate(() => {
      const divElements = document.querySelectorAll("div");

      console.log("divElements.length", divElements.length);

      let wrapperDiv;
      for (const div of divElements) {
        if (div.textContent.includes("All Fonts Ordered Alphabetically")) {
          wrapperDiv = div;
        }
      }
      console.log("wrapperDiv", wrapperDiv);

      const listEl = wrapperDiv.querySelector("ul");
      console.log("listEl", listEl);

      const linkAnchors = [];
      const childAnchors = Array.from(listEl.querySelectorAll("a"));
      linkAnchors.push(...childAnchors);
      console.log("linkAnchors", linkAnchors);

      const slugs = [];

      linkAnchors.forEach((anchor) => {
        const href = anchor.getAttribute("href");
        const slugMatch = href.split("/").pop();
        slugs.push(slugMatch);
      });

      return slugs;
    });

    console.log("Captured data of length", data.length);

    data.forEach((slug) => slugs.add(slug)); // Add new slugs to the Set

    console.log("Done! Here's what we got:", Array.from(slugs));

    await browser.close();
  } catch (error) {
    console.error("Error scraping data:", error);
  }
}

getAllTypeWolfFontSlugs();
