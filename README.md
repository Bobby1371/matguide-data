# MatGuide academy data

Public academy records for https://matguide.net, covering Los Angeles, Orange, Riverside, San Bernardino and San Diego counties.

## Editing the directory

Edit `academies.json`, preserving stable academy and instructor IDs (reviews reference them). Keep unknown details null; do not invent ratings, instructors, addresses or programs. Include official source URLs and the date the information was actually checked. Propose changes through pull requests.

Run `node validate-academies.mjs` with Node 22 or later before merging. GitHub Actions checks pull requests and pushes for invalid fields, duplicate IDs and duplicate name/city combinations. This checks structure, not whether a gym is open or a source is accurate.

## Publishing to MatGuide

GitHub is the source of the base academy directory. In the MatGuide Site checkout run `node scripts/sync-academies.mjs`, review the diff, and publish through Sites. Sync validates the entire dataset before replacing the bundled snapshot and records its GitHub commit. GitHub edits alone do not republish the Site. Visitors search the published snapshot without contacting GitHub or signing in.

Existing moderator-approved directory additions and edits in the Site database overlay this base catalog. They are not automatically written back to GitHub. Reconcile those changes before editing the same academy here. Reviews, account details, claims, billing and moderation records must never be added to this repository.

The initial 13 records were migrated from MatGuide without changing their contents or verification dates. No new research is implied by migration.

