# Sanity Setup Status

## Current state

Sanity has been integrated into the project at the data layer, and the editorial workflow is now working both locally and through the hosted browser Studio.

The site can now read article content from Sanity and fall back to local markdown files during migration. This means the public site remains stable while content is moved gradually.

A rich article body path has now been added for Sanity-authored articles, including inline image upload support through Sanity Studio, while keeping the existing markdown-backed article flow intact.

## Implemented

- Sanity dependencies were added to the project.
- Sanity config was added in `sanity.config.ts`.
- Sanity CLI config was added in `sanity.cli.ts`.
- An `article` schema was added in `sanity/schemaTypes/article.ts`.
- Shared schema export was added in `sanity/schemaTypes/index.ts`.
- A Sanity client was added in `lib/sanity/client.ts`.
- GROQ queries were added in `lib/sanity/queries.ts`.
- Hybrid article loading was added in `lib/articles.ts`.
- The Thoughts index now loads articles through the hybrid layer.
- Individual article pages now load through the hybrid layer.
- A Sanity webhook revalidation endpoint was added at `app/api/revalidate/sanity/route.ts`.
- Existing markdown rendering is preserved by continuing to send article bodies through the current markdown renderer.
- A new rich Sanity article body field was added alongside the legacy markdown body field for migration-safe rollout.
- Rich Sanity articles can now include inline uploaded images with alt text, captions, and hotspot/crop support.
- Article rendering now supports both markdown-string articles and rich Sanity Portable Text articles.
- A shared clickable image/lightbox component now supports both markdown images and Sanity-hosted images.
- Sanity image URL handling was added for frontend rendering.
- The Next app now allows Sanity CDN images in `next/image`.
- The rich article content path builds successfully in the local app.
- Local Sanity Studio now runs successfully as a standalone workflow via `pnpm studio`.
- Hosted Sanity Studio has been deployed successfully at `https://mzffreyvazov.sanity.studio/`.
- Studio environment resolution was fixed for the Vite-based Studio runtime.
- Local Sanity environment variables are configured and being read successfully.
- One test `article` has been created and published in Sanity.
- Browser-based publishing from the hosted Studio is working.
- Sanity webhook revalidation has been configured and is refreshing the deployed Next app.

## How the app behaves now

- Sanity is the preferred source for articles when a matching slug exists in both places.
- Local markdown remains as fallback so migration can happen one post at a time.
- The public site should continue working even if Sanity content is not yet populated.
- Publishing from Sanity works from both the local Studio and the hosted browser Studio.
- Published Sanity articles now appear in the deployed Next app, including the Thoughts list page after webhook-triggered revalidation.
- New or migrated Sanity articles can now use the rich body field for structured content and inline images.
- Existing markdown-backed articles still render unchanged.
- Existing Sanity articles using the legacy plain-text body field still render unchanged.

## Not completed yet

- Sanity Studio is not embedded in the Next app.
- There is currently no `/studio` route in the app.
- The embedded Studio attempt was intentionally rolled back because it was incompatible with the repo's experimental React stack.
- The Sanity schema exists in code and is now in active use, but should still be treated as the long-term source of truth and kept aligned with the hosted Studio.
- The hosted Studio still needs the updated schema deployed before the new `Rich Body` field appears there.
- Content migration beyond the initial test workflow still needs to be done.
- No broad structured article migration has been completed yet beyond the initial implementation and local validation.
- Markdown fallback cleanup has not started yet.

## Required environment variables

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_STUDIO_PROJECT_TITLE`
- `SANITY_REVALIDATE_SECRET`

## Recommended next steps

1. Deploy the updated Sanity schema so the hosted Studio exposes the new `Rich Body` field.
2. Create and publish one fully rich Sanity article with an uploaded image and verify it in the local and deployed site.
3. Migrate markdown posts gradually, one slug at a time.
4. Keep the Sanity schema in code aligned with the hosted Studio configuration.
5. Remove markdown fallback only after the migration is complete.

## Notes

- The current setup is intentionally hybrid to reduce migration risk.
- The hosted Studio at `https://mzffreyvazov.sanity.studio/` is now the primary publishing interface.
- Local `pnpm studio` remains useful as a fallback development workflow.
- Local Studio is currently the best place to validate the new rich article body workflow before deploying the schema to the hosted Studio.
- The package cleanup is already done: unused MDX dependencies were removed and Next was pinned explicitly.
- The current Studio config relies on `SANITY_STUDIO_*` variables, with a browser-safe fallback for the Vite runtime.
