// This script queries the Adobe Fonts API for all available fonts and writes them to sqlite

import { syncFontBatchToDatabase } from "./db.mjs";

let startingPage = 1;
const ALL_PAGES = false;

// interface AdobeFontFamily {
//   id: string;
//   name: string;
//   slug: string;
//   web_link: string;
//   browse_info: {
//     capitals: string[];
//     classification: string[];
//     contrast: string[];
//     language: string[];
//     number_style: string[];
//     recommended_for: string[];
//     weight: string[];
//     width: string[];
//     x_height: string[];
//   };
//   css_stack: string;
//   description: string;
//   foundry: {
//     name: string;
//     slug: string;
//   };
//   libraries: {
//     id: string;
//     name: string;
//   }[];
//   variations: any[];
// }

const getFamiliesListPage = async (pageNumber) => {
  try {
    const url = `https://typekit.com/api/v1/json/libraries/full?page=${pageNumber}`;
    const response = await fetch(url);
    const data = await response.json();
    const { families, pagination } = data.library;
    console.log(
      `Processing page #${pageNumber} of ${pagination.page_count}...`
    );
    const batchItems = await Promise.all(
      families.map(async (family) => syncTypekitFamilyIdToDatabase(family.id))
    );
    await syncFontBatchToDatabase(batchItems);
    if (!ALL_PAGES) return;
    return pageNumber < data.total_pages
      ? getFamiliesListPage(pageNumber + 1)
      : console.log("Done!");
  } catch (e) {
    console.error(e);
  }
};

const syncTypekitFamilyIdToDatabase = async (typekitFamilyId) => {
  const url = `https://typekit.com/api/v1/json/families/${typekitFamilyId}`;
  const response = await fetch(url);
  const data = await response.json();
  const family = data.family;
  console.log(`  ${typekitFamilyId} - ${data.family.name}`);
  return {
    name: family.name,
    style: family.css_stack,
  };
};

console.log("Syncing Adobe fonts to local sqlite db");
getFamiliesListPage(startingPage);
