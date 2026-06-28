const QUESTION_SCORES = [
  { yes: -3, no: 2 },
  { yes: 1, no: 0 },
  { yes: 1, no: 0 },
  { yes: 1, no: 0 },
  { yes: 1, no: 0 },
  { yes: 2, no: 0 },
  { yes: 1, no: 0 },
  { yes: 3, no: -2 }
];

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "Cache-Control": "no-store"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

function cleanText(value, maxLength) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidTime(value) {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const [hour, minute] = value.split(":").map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function parseAnswers(value) {
  if (!Array.isArray(value) || value.length !== QUESTION_SCORES.length) {
    return null;
  }

  if (value.some((answer) => answer !== "yes" && answer !== "no")) {
    return null;
  }

  return value;
}

function calculateScore(answers) {
  return answers.reduce(
    (total, answer, index) => total + QUESTION_SCORES[index][answer],
    0
  );
}

async function saveQuizSubmission(request, env) {
  const origin = request.headers.get("Origin");
  const siteOrigin = new URL(request.url).origin;

  // The form is intended to be posted by this same website only.
  if (origin && origin !== siteOrigin) {
    return jsonResponse({ error: "Cross-site requests are not allowed." }, 403);
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const name = cleanText(payload?.name, 24);
  const answers = parseAnswers(payload?.answers);

  if (!name || !answers) {
    return jsonResponse({ error: "Invalid quiz submission." }, 400);
  }

  const wantsDate = answers[7] === "yes" ? 1 : 0;
  const score = calculateScore(answers);

  let preferredDate = null;
  let preferredTime = null;
  let dateIdea = null;

  if (wantsDate && payload?.booking !== null && payload?.booking !== undefined) {
    preferredDate = cleanText(payload.booking.preferredDate, 10);
    preferredTime = cleanText(payload.booking.preferredTime, 5);
    dateIdea = cleanText(payload.booking.dateIdea, 120) || null;

    if (!isValidDate(preferredDate) || !isValidTime(preferredTime)) {
      return jsonResponse({ error: "Invalid booking date or time." }, 400);
    }
  }

  try {
    await env.DB.prepare(
      `INSERT INTO quiz_submissions (
        name,
        rizz_score,
        in_relationship,
        prays_before_eating,
        likes_guitar_boys,
        likes_tech_boys,
        likes_510_plus_men,
        likes_men_who_cook,
        likes_forehead_kisses,
        wants_date,
        preferred_date,
        preferred_time,
        date_idea
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        name,
        score,
        answers[0],
        answers[1],
        answers[2],
        answers[3],
        answers[4],
        answers[5],
        answers[6],
        wantsDate,
        preferredDate,
        preferredTime,
        dateIdea
      )
      .run();

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("D1 quiz insert failed:", error);
    return jsonResponse({ error: "Could not save submission." }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/quiz") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { Allow: "POST" }
        });
      }

      return saveQuizSubmission(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};
