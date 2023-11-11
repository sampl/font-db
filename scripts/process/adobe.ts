import type { AdobeFontFamily, FontFamily } from "../../types/types.js";
import { Database } from "sqlite-async";

import { ALL, ADOBE } from "../util/tableNames.js";
import { randomId } from "../util/randomId.js";
import { addRow, updateRow } from "../util/db.js";

const CLEAR_FIRST = true;
const PAGE_SIZE = 100;
const MULTIPLE_PAGES = true;

let db: Database | undefined;

const processAdobe = async () => {
  try {
    console.log("Processing Adobe fonts data...");
    db = await Database.open("../db/test.sqlite");
    const createTable = await db.prepare(
      `CREATE TABLE IF NOT EXISTS ${ALL} (
        id TEXT PRIMARY KEY,
        name TEXT,
        slug TEXT,
        adobeId TEXT,
        googleId TEXT,
        description TEXT,
        foundryName TEXT,
        designersNames JSON,
        contrast TEXT,
        weights JSON,
        variations JSON,
        type JSON,
        tags JSON,
        license TEXT,
        family TEXT,
        languages JSON,
        scripts JSON,
        hosted BOOLEAN,
        freeToUse BOOLEAN,
        googleFontsName TEXT,
        adobeFontsSlug TEXT,
        fontShareSlug TEXT
      )`
    );
    await createTable.run();
    await createTable.finalize();
    if (CLEAR_FIRST) {
      console.log("  Clearing table");
      await db.exec(`DELETE FROM ${ALL}`);
    }

    await processPage();
    console.log(`✅ Finished processing Adobe data`);
    await db.close();
  } catch (e) {
    console.error(`❌ Error processing Adobe data: ${e}`);
  }
};

const processPage = async (offset: number = 0) => {
  try {
    console.log(`Getting page #${offset / PAGE_SIZE + 1}`);
    const rows = await db.all(
      `SELECT * FROM ${ADOBE} LIMIT ${PAGE_SIZE} OFFSET ${offset}`
    );
    rows.forEach(async (row: { id: string; data: string }) => {
      console.log(`  Processing ${row.id}`);
      const adobeFont: AdobeFontFamily = JSON.parse(row.data);

      // ------------ START MERGE LOGIC ------------ //

      const mainFont: Partial<FontFamily> = {
        name: adobeFont.name,
        slug: adobeFont.slug,
        adobeFontsSlug: adobeFont.slug,
        description: adobeFont.description,
        hosted: true,
        freeToUse: Boolean(adobeFont.libraries.find((l) => l.id === "trial")),
      };

      if (adobeFont.foundry?.name) {
        mainFont.foundryName = adobeFont.foundry.name;
      }
      if (
        adobeFont.browse_info?.contrast === "low" ||
        adobeFont.browse_info?.contrast === "medium" ||
        adobeFont.browse_info?.contrast === "high"
      ) {
        mainFont.contrast = adobeFont.browse_info.contrast;
      }

      // ------------ END MERGE LOGIC ------------ //

      if (!mainFont.slug) {
        throw new Error(`No slug for ${adobeFont.name}`);
      }

      const matchingExistingFamily = await db.get(
        `SELECT * FROM ${ALL} WHERE name = ?`,
        adobeFont.name
      );

      if (matchingExistingFamily) {
        console.log(`Family ${adobeFont.name} already exists in ${ALL}`);
        const updatedFamily: FontFamily = {
          ...matchingExistingFamily,
          ...mainFont,
        };
        await updateRow(db, ALL, adobeFont.name, "name", updatedFamily);
      } else {
        const newFamily: FontFamily = {
          id: randomId(),
          name: adobeFont.name,
          slug: adobeFont.slug,
          ...mainFont,
        };
        await addRow(db, ALL, newFamily);
      }
    });
    if (MULTIPLE_PAGES && rows.length === PAGE_SIZE) {
      await processPage(offset + PAGE_SIZE);
    }
  } catch (e) {
    console.error(`❌ Error processing page: ${e}`);
  }
};

processAdobe();
