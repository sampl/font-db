import type {
  AdobeFontFamily,
  GoogleFontFamily,
  FontshareData,
  FontFamily,
} from "../../types/types.js";
import { Database } from "sqlite-async";

import { ALL, ADOBE, GOOGLE, FONTSHARE } from "../util/tableNames.js";
import { randomId } from "../util/randomId.js";
import { addRow, updateRow } from "../util/db.js";
import { superFamilies } from "../util/superFamilies";

const CLEAR_FIRST = true;
const PAGE_SIZE = 100;
const MULTIPLE_PAGES = true;

let db: Database | undefined;

// run like this: npx tsx scripts/process/process.ts google
// or with no args to process all
let runGoogle, runAdobe, runFontShare;
const args = process.argv.slice(2);
if (args.length) {
  const arg = args[0];
  if (arg === "google") {
    runGoogle = true;
  } else if (arg === "fontshare") {
    runFontShare = true;
  } else if (arg === "adobe") {
    runAdobe = true;
  } else {
    console.error(`❌ Unknown argument: ${arg}`);
    process.exit(1);
  }
} else {
  runGoogle = true;
  runAdobe = true;
  runFontShare = true;
}

const processFonts = async () => {
  try {
    console.log("Processing fonts data...");
    db = await Database.open("../db/test.sqlite");
    if (CLEAR_FIRST) {
      console.log(`Clearing ${ALL} table...`);
      await db.exec(`DROP TABLE ${ALL}`);
      const createTable = await db.prepare(
        // designersNames JSON,
        // weights JSON,
        // variations JSON,
        // type JSON,
        // tags JSON,
        // license TEXT,
        // family TEXT,
        // languages JSON,
        // scripts JSON,

        `CREATE TABLE ${ALL} (
          id TEXT PRIMARY KEY,
          name TEXT,
          slug TEXT,
          description TEXT,
          superFamily TEXT,

          foundryName TEXT,
          contrast TEXT,
          hosted BOOLEAN,
          freeToUse BOOLEAN,
          googleFontsFamily TEXT,
          adobeFontsSlug TEXT,
          adobeFontsId TEXT,
          fontShareSlug TEXT
        )`
      );
      await createTable.run();
      await createTable.finalize();
    }

    runAdobe && (await processPage(ADOBE, 0));
    runGoogle && (await processPage(GOOGLE, 0));
    runFontShare && (await processPage(FONTSHARE, 0));

    console.log(`✅ Finished processing font data`);
    await db.close();
  } catch (e) {
    console.error(`❌ Error processing font data: ${e}`);
  }
};

const processPage = async (table: string, offset: number = 0) => {
  try {
    console.log(`Getting ${table} page #${offset / PAGE_SIZE + 1}`);
    const rows = await db.all(
      `SELECT * FROM ${table} LIMIT ${PAGE_SIZE} OFFSET ${offset}`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows.forEach(async (row: any) => {
      const fontObject = JSON.parse(row.data);
      const processor =
        table === ADOBE
          ? processAdobeFont
          : table === GOOGLE
          ? processGoogleFont
          : table === FONTSHARE
          ? processFontShareFont
          : undefined;
      if (!processor) {
        throw new Error(`No processor function for ${table}`);
      }

      const { matchKey, matchData, newFontData } = processor(fontObject);

      const superFamily = superFamilies.find((sf) =>
        newFontData.name?.includes(sf)
      );
      if (superFamily) {
        newFontData.superFamily = superFamily;
      }

      const matchingExistingFamily = await db.get(
        `SELECT * FROM ${ALL} WHERE ${matchKey} = ?`,
        matchData
      );

      if (matchingExistingFamily) {
        console.log(`  ${matchKey} "${matchData}" found`);
        const updatedFamily: FontFamily = {
          ...matchingExistingFamily,
          ...newFontData,
        };
        await updateRow(db, ALL, matchKey, matchData, updatedFamily);
      } else {
        // @ts-ignore
        const newFamily: FontFamily = {
          id: randomId(),
          ...newFontData,
        };
        await addRow(db, ALL, newFamily);
      }
    });
    if (MULTIPLE_PAGES && rows.length === PAGE_SIZE) {
      await processPage(table, offset + PAGE_SIZE);
    }
  } catch (e) {
    console.error(`❌ Error processing page: ${e}`);
  }
};

const processAdobeFont = (adobeFont: AdobeFontFamily) => {
  const newFontData: Partial<FontFamily> = {
    adobeFontsId: adobeFont.id,
    adobeFontsSlug: adobeFont.slug,
    name: adobeFont.name,
    slug: adobeFont.slug,
    hosted: true,
    freeToUse: Boolean(adobeFont.libraries.find((l) => l.id === "trial")),
  };

  if (adobeFont.description) {
    newFontData.description = adobeFont.description;
  }
  if (adobeFont.foundry?.name) {
    newFontData.foundryName = adobeFont.foundry.name;
  }
  if (
    adobeFont.browse_info?.contrast === "low" ||
    adobeFont.browse_info?.contrast === "medium" ||
    adobeFont.browse_info?.contrast === "high"
  ) {
    newFontData.contrast = adobeFont.browse_info.contrast;
  }

  return {
    matchKey: "adobeFontsId",
    matchData: adobeFont.id,
    newFontData: newFontData,
  };
};

const processGoogleFont = (googleFont: GoogleFontFamily) => {
  const newFontData: Partial<FontFamily> = {
    googleFontsFamily: googleFont.family,
    name: googleFont.family,
    slug: googleFont.family.replace(/\s+/g, "-").toLowerCase(),
    hosted: true,
    freeToUse: true,
  };

  return {
    matchKey: "name",
    matchData: googleFont.family,
    newFontData: newFontData,
  };
};

const processFontShareFont = (fontShareFont: FontshareData) => {
  const newFontData: Partial<FontFamily> = {
    fontShareSlug: fontShareFont.slug,
    name: fontShareFont.name,
    slug: fontShareFont.slug,
    hosted: true,
    freeToUse: true,
  };

  return {
    matchKey: "slug",
    matchData: fontShareFont.slug,
    newFontData: newFontData,
  };
};

processFonts();
