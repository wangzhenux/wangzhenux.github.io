#!/usr/bin/env node
/**
 * Generate three synthetic renter-persona headshots with Google's Gemini image
 * model ("Nano Banana Pro" = gemini-3-pro-image). The faces are AI-generated and
 * fictional — persona stand-ins, not real people.
 *
 * Usage:
 *   GEMINI_API_KEY=… node scripts/gen-personas.mjs
 *   # optional: PERSONA_MODEL=gemini-2.5-flash-image  (Nano Banana, if Pro is unavailable)
 *
 * The key is read from the environment only — never hard-code it. Writes PNGs to
 * public/cases/unitpulse-site/personas/, which PersonaGrid references via `image`.
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
if (!KEY) {
  console.error('Set GEMINI_API_KEY (or GOOGLE_API_KEY) in your environment first.');
  process.exit(1);
}
const MODEL = process.env.PERSONA_MODEL || 'gemini-3-pro-image-preview';
const OUT = 'public/cases/unitpulse-site/personas';
mkdirSync(OUT, { recursive: true });

// Warm cream studio background (#FAF5E8) matches the site's --bg-primary so the
// avatars sit naturally on the card. Square framing; object-fit cover crops to circle.
const BG = 'plain warm cream studio background, soft warm natural lighting, head-and-shoulders, square 1:1 framing, shallow depth of field, no text, no logo';
const personas = [
  {
    file: 'decisive',
    prompt: `Photorealistic editorial headshot portrait of an East Asian woman in her early thirties, a relocating young professional, confident and friendly expression, smart-casual clothing, looking toward the camera. ${BG}.`,
  },
  {
    file: 'explorer',
    prompt: `Photorealistic editorial headshot portrait of a Latino man in his mid twenties, new to a city, warm curious and open expression, casual creative style. ${BG}.`,
  },
  {
    file: 'shortlister',
    prompt: `Photorealistic editorial headshot portrait of a Black woman in her mid thirties wearing glasses, thoughtful and considering expression, smart-casual clothing. ${BG}.`,
  },
];

const endpoint = (m) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;

async function gen(p) {
  const res = await fetch(endpoint(MODEL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: p.prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });
  if (!res.ok) {
    console.error(`✗ ${p.file}: HTTP ${res.status} — ${(await res.text()).slice(0, 300)}`);
    return false;
  }
  const data = await res.json();
  const part = data?.candidates?.[0]?.content?.parts?.find((x) => x.inlineData?.data);
  if (!part) {
    console.error(`✗ ${p.file}: no image in response — ${JSON.stringify(data).slice(0, 300)}`);
    return false;
  }
  const buf = Buffer.from(part.inlineData.data, 'base64');
  const path = `${OUT}/${p.file}.png`;
  writeFileSync(path, buf);
  console.log(`✓ ${path} (${(buf.length / 1024).toFixed(0)} KB)`);
  return true;
}

console.log(`Generating ${personas.length} persona headshots with ${MODEL}…`);
let ok = 0;
for (const p of personas) ok += (await gen(p)) ? 1 : 0;
console.log(`Done: ${ok}/${personas.length}. Next: optimize (sips -Z 512) + add image: "/cases/unitpulse-site/personas/<file>.png" to each persona in unitpulse-site.mdx.`);
