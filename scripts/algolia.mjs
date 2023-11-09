import dotenv from "dotenv";
import algoliasearch from "algoliasearch";
import { Database } from "sqlite-async";

// env vars
dotenv.config();
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_SECRET_ADMIN_KEY = process.env.ALGOLIA_SECRET_ADMIN_KEY;

// algolia
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SECRET_ADMIN_KEY);
const index = client.initIndex("typefaces_dev");

// get typefaces from sqlite
const getTypefaces = async () => {
  const typefaces = [];
  await Database.open("../db/test.sqlite")
    .then((db) => {
      return db.all("SELECT * FROM typefaces");
    })
    .then((rows) => {
      console.log(rows);
      rows.forEach((row) => {
        typefaces.push({
          objectID: row.id,
          name: row.name,
          style: row.style,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });

  return typefaces;
};

const syncAlgolia = async () => {
  const typefaces = await getTypefaces();
  index
    .saveObjects(typefaces, {
      autoGenerateObjectIDIfNotExist: true,
    })
    .then(({ objectIDs }) => {
      console.log(objectIDs);
    });
};

syncAlgolia();
