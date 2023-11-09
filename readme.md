# Font DB

🚧🚧🚧 WORK IN PROGRESS, JUST MESSING AROUND 🚧🚧🚧

## How it works

Scripts update a sqlite db in the repo and sync it to Algolia.

## Development

Note: when setting up Algolia, make sure to add all attributes to Facets and Searchable Attributes under index configuration.

## TODO

- [ ] Scripts to populate font db
  - [ ] Adobe Fonts - https://typekit.com/api/v1/json/libraries/full and https://typekit.com/api/v1/json/families/<id>
  - [ ] Google Fonts - https://developers.google.com/fonts/docs/developer_api
  - [ ] MyFonts - https://dev.myfonts.com/docs/#overview
  - [ ] Monotype? - https://fonts-api.monotype.com/apis
- [ ] Show font previews with web font loader https://github.com/typekit/webfontloader
- [ ] Firebase hosting
- [ ] Get Algolia plan onto long-term free tier (docs discount?)

Later: real accounts

- [ ] Firebase auth
- [ ] Users can save favorites and add to lists (Firestore?)
- [ ] Integrated admin panel for responding to reported issues/submissions
- Editors can use a UI to edit data (requires moving off SQLite to at least Firestore, maybe Postgres)
