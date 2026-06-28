# Rizz Scanner + Cloudflare D1

This project keeps the existing quiz and Google Calendar flow, then saves every completed quiz to Cloudflare D1.

## What is stored

- name
- Rizz score
- every yes/no quiz answer (each in its own column)
- whether they said yes to the date
- selected date/time and optional date idea, when supplied
- the server-side submission time

The public Worker has only one write endpoint: `POST /api/quiz`. There is no public endpoint that lists your saved answers.

## Dashboard setup (no terminal needed)

1. In Cloudflare, open **Workers & Pages** > **D1 SQL Database**.
2. Create a database named `treats-answers`.
3. Open that database > **Console**. Paste everything from `schema.sql`, then select **Execute**.
4. Open the Worker that powers `treats.clarencecreations.workers.dev`.
5. Go to **Settings** > **Bindings** > **Add binding** > **D1 database**.
6. Set the variable name to exactly `DB`, select `treats-answers`, then save/deploy.
7. Deploy this project as a Workers Static Assets project. The website files are in `/public`; `worker.js` handles only `/api/quiz` and passes normal requests to the static site.

## Wrangler / GitHub deployment

1. Replace `PASTE_YOUR_D1_DATABASE_ID_HERE` in `wrangler.jsonc` with the database ID from Cloudflare.
2. From this folder run:

   ```bash
   npx wrangler d1 execute treats-answers --remote --file=./schema.sql
   npx wrangler deploy
   ```

3. Open the site and complete a test. The final screen should say **Response saved privately 💗**.

## View answers

Open Cloudflare > **D1 SQL Database** > `treats-answers` > **Console**, then run:

```sql
SELECT
  id,
  name,
  rizz_score,
  in_relationship,
  prays_before_eating,
  likes_guitar_boys,
  likes_tech_boys,
  likes_510_plus_men,
  likes_men_who_cook,
  likes_forehead_kisses,
  CASE wants_date WHEN 1 THEN 'yes' ELSE 'no' END AS wants_date,
  preferred_date,
  preferred_time,
  date_idea,
  created_at
FROM quiz_submissions
ORDER BY id DESC;
```

For a database backup, Wrangler can export your D1 database as SQL:

```bash
npx wrangler d1 export treats-answers --remote --output=./treats-answers.sql
```

## Important

The text on the first screen now tells people their answers and any date request are saved. Keep that notice visible when collecting names and date preferences.
