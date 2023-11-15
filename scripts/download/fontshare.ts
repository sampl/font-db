import puppeteer, { Browser, Page } from "puppeteer";
import { Database } from "sqlite-async";

import { FONTSHARE as TABLE_NAME } from "../util/tableNames";
import type { FontshareData } from "../../types/types";
import { addRow } from "../util/db";

const LAST_HREF = "/fonts/manrope";
const DELAY_BETWEEN_SCROLLS = 3 * 1000;
const SAVE_TO_DB = true;
const GET_SUB_PAGES = true;

let db: Database | undefined,
  browser: Browser | undefined,
  page: Page | undefined;

async function getData() {
  try {
    console.log("Getting Fontshare data...");
    db = await Database.open("../db/test.sqlite");
    browser = await puppeteer.launch({ headless: "new" });
    page = await browser.newPage();
    await getAllSlugs();
    if (browser.isConnected()) {
      await browser.close();
    }
    await db.close();
    console.log("✅ Finish getting Fontshare data");
  } catch (error) {
    console.error(`❌ Error getting Fontshare data: ${error}`);
  }
}

async function getAllSlugs() {
  try {
    if (!page) throw new Error("No puppeteer page to use");

    await page.goto("https://fontshare.com", { waitUntil: "domcontentloaded" });

    // Use a Set to avoid duplicates
    const slugs = new Set<string>();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // await page.waitForSelector(".SpHjZE6q");
      // console.log("Found at least one .SpHjZE6q element");

      const data = await page.evaluate(() => {
        const linkAnchors = Array.from(document.querySelectorAll(".SpHjZE6q"));
        const slugs: string[] = [];

        linkAnchors.forEach((anchor) => {
          const href = anchor.getAttribute("href");
          if (!href) return;
          const slugMatch = href.match(/\/fonts\/(.*)/);
          if (slugMatch) {
            slugs.push(slugMatch[1]);
          }
        });

        return slugs;
      });

      data.forEach((slug) => slugs.add(slug)); // Add new slugs to the Set
      console.log(`Found ${slugs.size} slugs so far`);

      // Scroll to the end of the content container
      await page.evaluate(() => {
        const scrollContainer = document.getElementById("scrollContainer");
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      });

      // Check for the appearance of an anchor with the specified href
      const endOfContent = await page.evaluate((LAST_HREF) => {
        const endAnchor = document.querySelector(`a[href="${LAST_HREF}"]`);
        return !!endAnchor;
      }, LAST_HREF);

      if (endOfContent) {
        break;
      }

      await page.waitForTimeout(DELAY_BETWEEN_SCROLLS);
      console.log("Waiting for new items to load...");
    }

    const slugsArray: string[] = Array.from(slugs);
    console.log("Finished index page");

    if (!SAVE_TO_DB) {
      console.log("✅ Not saving to DB, set SAVE_TO_DB to true to save");
      return;
    } else {
      console.log(`Syncing batch of ${slugsArray.length} items to database`);
      const createTable = await db.prepare(
        `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (slug TEXT PRIMARY KEY, data TEXT)`
      );
      await createTable.run();
      await createTable.finalize();
      await db.exec(`DELETE FROM ${TABLE_NAME}`);
      await Promise.all(
        slugsArray.map(async (slug) => {
          await addRow(db, TABLE_NAME, {
            slug,
          });
        })
      );
    }

    if (GET_SUB_PAGES) {
      await getPage("manrope");
      for (const slug of slugsArray) {
        await getPage(slug);
      }
    }

    console.log("Done getting Fontshare slugs");
  } catch (error) {
    console.error(`❌ Error getting Fontshare slugs: ${error}`);
  }
}

const getPage = async (slug: string) => {
  console.log(`Getting data for family ${slug}`);

  if (!page) throw new Error("No puppeteer page to use");
  await page.goto(`https://fontshare.com/fonts/${slug}`, {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector(".IfhptcLx");
  // if (page.$$(".IfhptcLx").length < 2) {
  //   await page.waitForTimeout(1000);
  // }
  console.log(`  Fully loaded page`);

  // ------- START IN-BROWSER EVAL CONTENT ------- //
  const rawData = await page.evaluate(() => {
    const attributes = [
      {
        label: "Family Name",
        key: "name",
      },
      {
        label: "Designed By",
        key: "designers",
      },
      {
        label: "Category",
        key: "category",
      },
      {
        label: "Version",
        key: "version",
      },
      {
        label: "Fontshare Debut",
        key: "fontshareDebut",
      },
      {
        label: "Tags / Keywords",
        key: "tags",
      },
      {
        label: "License",
        key: "license",
      },
      {
        label: "Supported Languages",
        key: "supportedLanguages",
      },
      {
        label: "Available Styles",
        key: "availableStyles",
      },
    ];

    const DROPDOWN_CLASS = ".IfhptcLx";
    const LABEL_CLASS = ".ovU5FwPG";
    const ROW_CLASS = ".JQ82K3L3";

    const returnable = attributes.reduce((acc, curr) => {
      const { label, key } = curr;
      const rows = document.querySelectorAll(ROW_CLASS);
      if (!rows) return acc;
      const rowEls = Array.from(rows);
      const row = rowEls.find((rowEl) => {
        return rowEl.querySelector(LABEL_CLASS)?.textContent?.trim() === label;
      });

      // TODO - for some reason this doesn't see the supported languages dropdown
      const dropdown = row?.parentElement?.querySelector(DROPDOWN_CLASS);

      let text;
      if (dropdown) {
        text = dropdown.textContent
          ?.split("\n")
          .filter((i) => i.trim().length)
          .map((i) => i.trim());
      } else {
        // text = row?.textContent?.trim();
        const child = row?.children[1];
        if (!child) return acc;
        text = child.textContent?.trim();
      }

      return {
        ...acc,
        [key]: text,
      };
    }, {});

    return returnable;
  });
  // ------- END IN-BROWSER EVAL CONTENT ------- //

  // @ts-ignore
  const data: FontshareData = {
    slug,
    ...rawData,
  };

  console.log(`  Got data for family ${slug}`);

  if (!data.name) throw new Error("Could not find name");
  if (!data.designers) throw new Error("Could not find designers");
  if (!data.category) throw new Error("Could not find category");
  if (!data.version) throw new Error("Could not find version");
  if (!data.fontshareDebut) throw new Error("Could not find fontshare debut");
  if (!data.tags) throw new Error("Could not find tags");
  if (!data.license) throw new Error("Could not find license");
  // if (!data.supportedLanguages) throw new Error("Could not find languages");
  if (!data.availableStyles) throw new Error("Could not find styles");

  // return; // debugging

  if (!SAVE_TO_DB) {
    console.log("✅ Not saving to DB, set SAVE_TO_DB to true to save");
    return;
  } else {
    console.log(`  Syncing font family ${data.name} to database`);
    await addRow(db, TABLE_NAME, {
      slug,
      data: JSON.stringify(data),
    });
  }
};

getData();

// [
//   'satoshi',           'clash-display',    'general-sans',
//   'cabinet-grotesk',   'ranade',           'chillax',
//   'clash-grotesk',     'switzer',          'panchang',
//   'stardom',           'zodiak',           'sentient',
//   'supreme',           'boska',            'author',
//   'telma',             'bespoke-serif',    'gambetta',
//   'tanker',            'excon',            'gambarino',
//   'neco',              'alpino',           'quilon',
//   'pally',             'bespoke-sans',     'erode',
//   'pencerio',          'nippo',            'sharpie',
//   'pramukh-rounded',   'plein',            'bespoke-stencil',
//   'amulya',            'bevellier',        'synonym',
//   'bonny',             'comico',           'rowan',
//   'aktura',            'technor',          'bespoke-slab',
//   'britney',           'array',            'styro',
//   'recia',             'melodrama',        'rosaline',
//   'hoover',            'trench-slab',      'chubbo',
//   'boxing',            'rx-100',           'kola',
//   'paquito',           'zina',             'tabular',
//   'expose',            'segment',          'kihim',
//   'pilcrow-rounded',   'striper',          'new-title',
//   'kohinoor-zerone',   'quicksand',        'kalam',
//   'merriweather-sans', 'asap',             'nunito',
//   'crimson-pro',       'karma',            'red-hat-display',
//   'plus-jakarta-sans', 'familjen-grotesk', 'beVietnam-pro',
//   'literata',          'hind',             'bebas-neue',
//   'public-sans',       'lora',             'work-sans',
//   'epilogue',          'anton',            'khand',
//   'azeret-mono',       'dancing-script',   'fira-sans',
//   'rajdhani',          'outfit',           'sora',
//   'poppins',           'oswald',           'space-grotesk',
//   'archivo',           'jet-brains-mono',  'montserrat',
//   'teko',              'roundo',           'spline-sans',
//   'manrope'
// ]
