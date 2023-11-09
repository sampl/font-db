// Database utils

import { Database } from "sqlite-async";

export const syncFontBatchToDatabase = async (batchItems) => {
  const db = await Database.open("../db/test.sqlite");
  // TODO - upserts
  const stmt = await db.prepare("INSERT INTO typefaces VALUES (?, ?)");
  batchItems.forEach(({ name, style }) => stmt.run(name, style));
  stmt.finalize();
  db.close();
};

export const getAllFonts = async () => {
  const db = await Database.open("../db/test.sqlite");
  const rows = await db.all("SELECT * FROM typefaces");
  console.log(rows);
  db.close();
};
