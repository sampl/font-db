import { Database } from "sqlite-async";

import type { AdobeFontFamily } from "../../types/types.js";
import { ADOBE as TABLE_NAME } from "../util/tableNames.js";
import { addRow } from "../util/db.js";

const ALL_PAGES = true;
const CLEAR_FIRST = false;
const STARTING_PAGE = 1;

// for some reason the API says page numbers 101 and higher are invalid,
// so we need to do this in bigger bites (default is 20)
// NOTE - this sense N requests simultaneously, so if you put it any higher
// you should refactor the Promise.all below!
const PAGE_SIZE = 80;

let db: Database | undefined;

const getData = async () => {
  try {
    console.log("Getting Adobe fonts data...");
    db = await Database.open("../db/test.sqlite");

    const createTable = await db.prepare(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (name TEXT PRIMARY KEY, id TEXT, slug TEXT, data TEXT)`
    );
    await createTable.run();
    await createTable.finalize();
    if (CLEAR_FIRST) {
      console.log("  Clearing table...");
      await db.exec(`DELETE FROM ${TABLE_NAME}`);
    }

    await getFamiliesListPage(STARTING_PAGE);
    await db.close();
    console.log("✅ Finished getting Adobe data");
  } catch (e) {
    console.error(`❌ Error getting Adobe data: ${e}`);
  }
};

const getFamiliesListPage = async (pageNumber) => {
  try {
    // https://fonts.adobe.com/docs/api
    console.log(`Getting page #${pageNumber}`);
    const url = `https://typekit.com/api/v1/json/libraries/full?page=${pageNumber}&per_page=${PAGE_SIZE}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.errors) {
      // "Not Found" means we hit the end and we're done
      if (data.errors[0] !== "Not Found") {
        console.error("❌ Error getting data", data.errors);
      }
      return;
    }
    const { families, pagination } = data.library;
    console.log(`  Got page #${pageNumber} of ${pagination.page_count}`);

    // TODO - use a loop instead of promise.all so we don't send too many requests at once?
    const familyPromises = families.map(async ({ id }) => {
      const url = `https://typekit.com/api/v1/json/families/${id}`;
      const response = await fetch(url);
      const data = await response.json();
      const family: AdobeFontFamily = data.family;
      // console.log(`  Got ${id} - ${family.name}`);
      return family;
    });
    const batchItems = await Promise.all(familyPromises);

    console.log(
      `  Saving batch of ${batchItems.length} items starting with ${batchItems[0].name}`
    );
    await Promise.all(
      batchItems.map(async (item) => {
        await addRow(db, TABLE_NAME, {
          name: item.name,
          id: item.id,
          slug: item.slug,
          data: JSON.stringify(item),
        });
      })
    );

    if (!ALL_PAGES) {
      console.log("✅ Stopping early, set ALL_PAGES to true to get all pages");
      return;
    }
    if (pageNumber >= data.total_pages) {
      return;
    }
    await getFamiliesListPage(pageNumber + 1);
  } catch (e) {
    console.error(`❌ Error getting page #${pageNumber}): ${e}`);
  }
};

getData();
