import dotenv from "dotenv";
import { Database } from "sqlite-async";

import type { GoogleFontFamily } from "../../types/types";
import { GOOGLE as TABLE_NAME } from "../util/tableNames";
import { addRow } from "../util/db";

dotenv.config();
const GOOGLE_FONTS_API_KEY = process.env.GOOGLE_FONTS_API_KEY;

const CLEAR_FIRST = true;

let db: Database | undefined;

const getData = async () => {
  try {
    console.log("Getting Google data...");
    db = await Database.open("../db/test.sqlite");

    const createTable = await db.prepare(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (family TEXT PRIMARY KEY, data TEXT)`
    );
    await createTable.run();
    await createTable.finalize();
    if (CLEAR_FIRST) {
      console.log("  Clearing table");
      await db.exec(`DELETE FROM ${TABLE_NAME}`);
    }

    await getGoogleFonts();
    await db.close();
    console.log("✅ Finished getting Google data");
  } catch (e) {
    console.error(`❌ Error getting Google data: ${e}`);
  }
};

const getGoogleFonts = async () => {
  try {
    // https://developers.google.com/fonts/docs/developer_api
    const key = `key=${GOOGLE_FONTS_API_KEY}`;
    const url = `https://www.googleapis.com/webfonts/v1/webfonts?${key}`;
    const response = await fetch(url);
    const data = await response.json();
    const items: GoogleFontFamily[] = data.items;
    console.log(`Got response with ${items.length} items`);

    console.log(`Syncing batch of ${items.length} items to database`);
    await Promise.all(
      items.map(
        async (item) =>
          await addRow(db, TABLE_NAME, {
            family: item.family,
            data: JSON.stringify(item),
          })
      )
    );

    // TODO - also query by popularity/hot etc and save that to db too
  } catch (e) {
    console.error(`❌ Error getting Google font: ${e}`);
  }
};

getData();
