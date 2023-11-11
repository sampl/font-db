# Font DB

🚧🚧🚧 WORK IN PROGRESS, JUST MESSING AROUND 🚧🚧🚧

## How it works

Basically we grab a bunch of font data, store it in SQLite, and upload it to Algolia for search.

1. The [download scripts](/scripts/download/) gather data from font service APIs etc and puts it in separate SQL tables
2. The [process scripts](/scripts/process/) use texts matching etc to combine data from individual sources into a single table
3. An [upload script](/scripts/upload/) uploads the new table to the Algolia search index

## Development

Use tsx to run typescript scripts: `npx tsx scripts/download/google.ts`

Note: when setting up Algolia, make sure to add all attributes to Facets and Searchable Attributes under index configuration.
TODO - do this automatically in the upload script

## TODO

Next: basic search

- [ ] More resolvers
- [ ] Update index
- [ ] Get Algolia plan onto long-term free tier [https://www.algolia.com/for-open-source/]

Later: more sources

- [ ] MyFonts? 200k+ [https://dev.myfonts.com/docs/#overview]
- [ ] Spreadsheet override

Later: app styles

- [ ] Mobile styles
- [ ] Smoother transitions

Later: real accounts

- [ ] Firebase/Clerk/Supabase auth
- [ ] Users can save favorites and add to lists (Firestore?)
- [ ] Integrated admin panel for responding to reported issues/submissions
- [ ] Editors can use a UI to edit data (requires moving off SQLite to at least Firestore, maybe Postgres)
