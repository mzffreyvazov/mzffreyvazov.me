# Sanity Setup Status

## Current state

Sanity has been integrated into the project at the data layer, and the standalone editorial workflow is now working locally.

The site can now read article content from Sanity and fall back to local markdown files during migration. This means the public site remains stable while content is moved gradually.

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
- Local Sanity Studio now runs successfully as a standalone workflow via `pnpm studio`.
- Studio environment resolution was fixed for the Vite-based Studio runtime.
- Local Sanity environment variables are configured and being read successfully.
- One test `article` has been created and published in Sanity.

## How the app behaves now

- Sanity is the preferred source for articles when a matching slug exists in both places.
- Local markdown remains as fallback so migration can happen one post at a time.
- The public site should continue working even if Sanity content is not yet populated.
- Publishing from Sanity works in local Studio, but site freshness still depends on frontend runtime and revalidation setup.

## Not completed yet

- Sanity Studio is not embedded in the Next app.
- There is currently no `/studio` route in the app.
- The embedded Studio attempt was intentionally rolled back because it was incompatible with the repo's experimental React stack.
- The Sanity schema exists in code, but still needs to be deployed and verified as the long-term source of truth for the target Sanity project.
- The required Sanity environment variables still need to be configured in Vercel.
- The Sanity webhook still needs to be configured in the Sanity project settings.
- Frontend verification of the published Sanity article still needs to be completed on the Next app.
- No structured article migration has been completed yet beyond the initial test content.
- Markdown fallback cleanup has not started yet.

## Required environment variables

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_STUDIO_PROJECT_TITLE`
- `SANITY_REVALIDATE_SECRET`

## Recommended next steps

1. Set the required Sanity environment variables locally and in Vercel.
2. Verify the published test `article` appears on the Thoughts index and article page in the Next app.
3. Configure the remaining Sanity environment variables in Vercel.
4. Configure the Sanity webhook to call `/api/revalidate/sanity`.
5. Deploy the Studio with `pnpm studio:deploy` once the content model is verified.
6. Migrate markdown posts gradually, one slug at a time.
7. Remove markdown fallback only after the migration is complete.

## Notes

- The current setup is intentionally hybrid to reduce migration risk.
- Using standalone Studio is the safest next step with the current React and Next stack.
- The package cleanup is already done: unused MDX dependencies were removed and Next was pinned explicitly.
- The current Studio config relies on `SANITY_STUDIO_*` variables, with a browser-safe fallback for the Vite runtime.
