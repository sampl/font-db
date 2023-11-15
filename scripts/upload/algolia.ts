import dotenv from "dotenv";
import algoliasearch from "algoliasearch";

import { FontFamily } from "../../types/types";
import { Database } from "sqlite-async";
import { ALL } from "../util/tableNames";

const PAGE_SIZE = 100;
const MULTIPLE_PAGES = false;

dotenv.config();
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_SECRET_ADMIN_KEY = process.env.ALGOLIA_SECRET_ADMIN_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

if (!ALGOLIA_APP_ID || !ALGOLIA_SECRET_ADMIN_KEY || !ALGOLIA_INDEX_NAME) {
  console.error("Missing Algolia env vars");
  process.exit(1);
}
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SECRET_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const syncAlgolia = async () => {
  try {
    const db = await Database.open("../db/test.sqlite");

    let offset = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log(`Processing page ${offset / PAGE_SIZE}`);
      const rows = await db.all(
        `SELECT * FROM ${ALL} LIMIT ${PAGE_SIZE} OFFSET ${offset}`
      );
      const updates: FontFamily[] = rows.map((row) => ({
        objectID: row.id,
        ...row,
      }));
      // https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/sending-records-in-batches/#using-the-api
      const { objectIDs } = await index.saveObjects(updates);
      if (objectIDs) {
        console.log(`Uploaded ${objectIDs.length} items`);
      } else {
        throw new Error(`No objectIDs returned`);
      }

      if (objectIDs.length < PAGE_SIZE) break;
      if (!MULTIPLE_PAGES) break;
      offset += PAGE_SIZE;
    }

    // https://www.algolia.com/doc/api-reference/api-parameters/searchableAttributes
    console.log(`Setting search attributes`);
    // TODO - actual attributes
    await index.setSettings({
      searchableAttributes: ["name", "description", "foundryName"],
      attributesForFaceting: [
        "superFamily",
        "foundryName",
        "contrast",
        "hosted",
        "freeToUse",
      ],
    });

    console.log(`✅ Finished uploading to Algolia`);
  } catch (e) {
    console.error(`❌ Error uploading to Algolia: ${e}`);
  }
};

syncAlgolia();
