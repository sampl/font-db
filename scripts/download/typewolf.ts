import puppeteer, { Browser, Page } from "puppeteer";
import { Database } from "sqlite-async";

import { TYPEWOLF as TABLE_NAME } from "../util/tableNames";
import { addRow } from "../util/db";

const SAVE_TO_DB = true;

let db: Database | undefined,
  browser: Browser | undefined,
  page: Page | undefined;

const getData = async () => {
  try {
    console.log("Getting Typewolf data...");
    db = await Database.open("../db/test.sqlite");
    browser = await puppeteer.launch({ headless: "new" });
    page = await browser.newPage();
    await getAllSlugs();
    await browser.close();
    await db.close();
    console.log("✅ Finished getting TypeWolf data");
  } catch (error) {
    console.error(`❌ Error getting TypeWolf data: ${error}`);
  }
};

async function getAllSlugs() {
  try {
    if (!page) throw new Error("No puppeteer page to use");

    await page.goto("https://www.typewolf.com/all-fonts", {
      waitUntil: "domcontentloaded",
    });

    // Use a Set to avoid duplicates
    const slugs = new Set();

    await page.waitForSelector(".tag-collection");

    const data = await page.evaluate(() => {
      const divElements = document.querySelectorAll("div");

      console.log("divElements.length", divElements.length);

      let wrapperDiv: HTMLDivElement | null = null;
      for (const div of divElements) {
        if (!div.textContent) continue;
        if (div.textContent.includes("All Fonts Ordered Alphabetically")) {
          wrapperDiv = div;
        }
      }
      if (!wrapperDiv) throw new Error("Couldn't find wrapperDiv");

      const listEl = wrapperDiv.querySelector("ul");
      if (!listEl) throw new Error("Couldn't find listEl");

      const linkAnchors: HTMLAnchorElement[] = Array.from(
        listEl.querySelectorAll("a")
      );

      const slugs: string[] = [];

      linkAnchors.forEach((anchor) => {
        const href = anchor.getAttribute("href");
        if (!href) return;
        const slugMatch = href.split("/").pop();
        if (!slugMatch) return;
        slugs.push(slugMatch);
      });

      return slugs;
    });

    console.log("Captured data of length", data.length);

    data.forEach((slug) => slugs.add(slug)); // Add new slugs to the Set

    const slugsArray = Array.from(slugs);
    console.log("Here's what we got:", slugsArray);

    if (!SAVE_TO_DB) {
      console.log("✅ Not saving to DB, set SAVE_TO_DB to true to save");
      return;
    }
    console.log(`Syncing batch of ${slugsArray.length} items to database`);
    const createTable = await db.prepare(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (slug TEXT PRIMARY KEY)`
    );
    await createTable.run();
    await createTable.finalize();
    await db.exec(`DELETE FROM ${TABLE_NAME}`);

    await Promise.all(
      slugsArray.map(
        async (slug) =>
          await addRow(db, TABLE_NAME, {
            slug,
          })
      )
    );
  } catch (error) {
    console.error(`❌ Error getting TypeWolf slugs: ${error}`);
  }
}

getData();
