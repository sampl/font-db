# Font DB

🚧🚧🚧 WORK IN PROGRESS, JUST MESSING AROUND 🚧🚧🚧

## How it works

Basically we grab a bunch of font data, store it in SQLite, and upload it to Algolia for search.

1. The [download scripts](/scripts/download/) gather data from font service APIs etc and puts it in separate SQL tables
2. The [process scripts](/scripts/process/) use texts matching etc to combine data from individual sources into a single table
3. An [upload script](/scripts/upload/) uploads the new table to the Algolia search index

## Development

- Get secret keys for an Algolia instance and Google Fonts API and add to `/scripts/.env` (see `/scripts/.env.example`)
- Use typescript to run scripts: `npx tsx scripts/download/google.ts`

## TODO

Ready

- [ ] More resolvers
- [ ] Update index
- [ ] Get Algolia plan onto long-term free tier [https://www.algolia.com/for-open-source/]

Next

- [ ] Radix select lists
- [ ] React router
- [ ] Use a class so we know both types and objects?
- [ ] Run through data and extract all possible values for enum cols
- [ ] Link to contribute.md

Soon

- [ ] Mobile styles
- [ ] Question mark guides on refinements with illustrated examples
  - Ie “contrast refers to how much the stroke thickness varies within a glyph”
  - Low/no contrast: Futura
  - Moderate contrast: Baskerville
  - Very high contrast: Bodoni
- [ ] zod? Orm?
- [ ] Combine related font families, ie all “Garamond”. Overrides for combining families?
- [ ] log changes for changelog.html
- [ ] Manual override spreadsheet
- [ ] manual override beats Wikipedia but Wikipedia beats Google fonts etc?
- [ ] Calculate font features via https://www.npmjs.com/package/fontkit
- [ ] Formspree - collect emails
- [ ] Router with tabs on the left for individual pages - just anchor links
- [ ] Spreadsheet override

Later

- [ ] Smoother transitions
- [ ] MyFonts? 200k+ [https://dev.myfonts.com/docs/#overview]
- [ ] Firebase/Clerk/Supabase auth
- [ ] Users can save favorites and add to lists (Firestore?)

Someday

- [ ] Integrated admin panel for responding to reported issues/submissions
- [ ] Editors can use a UI to edit data (requires moving off SQLite to at least Firestore, maybe Postgres)

Maybe

- [ ] Scrape attrs from fontShare index page - or will they come with Adobe etc?
