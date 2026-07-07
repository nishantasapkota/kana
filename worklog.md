---
Task ID: 1
Agent: Main Agent
Task: Migrate Japanese learning app from static files to Neon PostgreSQL with API routes and admin form

Work Log:
- Updated .env with Neon PostgreSQL connection string
- Rewrote prisma/schema.prisma with PostgreSQL provider, KanaCharacter and KanaSentence models
- Ran `prisma db push` to create tables in Neon, `prisma generate` to create client
- Created prisma/seed.ts with all 46 hiragana, 46 katakana, 20 hiragana sentences, 20 katakana sentences
- Successfully seeded Neon database
- Created API routes:
  - GET /api/kana?type=hira/kata — fetch all kana characters from DB
  - GET /api/sentences?type=hira/kata — list sentences
  - POST /api/sentences — add new sentence
  - DELETE /api/sentences/delete?id=N — delete sentence
  - GET /api/quiz/character?type&direction — generates random MCQ character quiz
  - GET /api/quiz/sentence?type — generates random sentence quiz with blanks
  - POST /api/quiz/sentence — gets options for subsequent blanks in a sentence
- Rewrote src/lib/store.ts to use API-backed data with client-side caching:
  - Fetches all kana data in one batch call when quiz starts
  - Generates MCQ questions client-side from cached data (resilient to server restarts)
  - Admin CRUD operations still use direct API calls
- Updated src/lib/db.ts with Neon connection
- Updated src/components/character-quiz.tsx with loading states for async data
- Updated src/components/sentence-quiz.tsx with loading states for async data
- Updated src/components/quiz-header.tsx to handle async store methods
- Updated src/components/landing.tsx with "Manage Sentences" admin link
- Created src/components/admin-form.tsx — full admin UI with:
  - Add sentence form (kana type, text with ＿ blanks, reading, meaning, blank answers)
  - Filterable sentence list (all/hiragana/katakana)
  - Delete button per sentence
- Updated src/app/page.tsx to include AdminForm view
- Deleted src/lib/kana-data.ts (no longer needed)
- Verified: `next build` succeeds, `eslint` passes, all 6 API endpoints return correct data from Neon

Stage Summary:
- App now uses Neon PostgreSQL for all kana character and sentence data
- 6 API routes created for data access and CRUD
- Admin form allows adding/deleting sentences via the UI
- Client-side caching ensures quiz works even when server restarts
- Verified via curl: 46 hiragana + 46 katakana chars, 20+20 sentences, quiz MCQ generation all working
- Files created: prisma/seed.ts, src/app/api/kana/route.ts, src/app/api/sentences/route.ts, src/app/api/sentences/delete/route.ts, src/app/api/quiz/character/route.ts, src/app/api/quiz/sentence/route.ts, src/components/admin-form.tsx
- Files modified: prisma/schema.prisma, src/lib/db.ts, src/lib/store.ts, src/components/character-quiz.tsx, src/components/sentence-quiz.tsx, src/components/quiz-header.tsx, src/components/landing.tsx, src/app/page.tsx, next.config.ts
- Files deleted: src/lib/kana-data.ts