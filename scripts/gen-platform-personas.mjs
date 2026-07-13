#!/usr/bin/env node
/**
 * Generate three synthetic USER-persona headshots for the UnitPulse Platform
 * case (landlord / property manager / leasing agent) with Google's Gemini image
 * model — same pipeline as scripts/gen-personas.mjs (renter personas for the
 * unitpulse-site case). The faces are AI-generated and fictional — persona
 * stand-ins, not real people.
 *
 * Usage:
 *   GEMINI_API_KEY=… node scripts/gen-platform-personas.mjs
 *   # optional: PERSONA_MODEL=gemini-2.5-flash-image  (Nano Banana, if Pro is unavailable)
 *
 * The key is read from the environment only — never hard-code it. Writes PNGs to
 * public/cases/unitpulse-platform/personas/; then add
 * image: "/cases/unitpulse-platform/personas/<file>.png" to each persona in
 * unitpulse-platform.mdx (and optimize: sips -Z 512 <file>).
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
if (!KEY) {
  console.error('Set GEMINI_API_KEY (or GOOGLE_API_KEY) in your environment first.');
  process.exit(1);
}
const MODEL = process.env.PERSONA_MODEL || 'gemini-3-pro-image-preview';
const OUT = 'public/cases/unitpulse-platform/personas';
mkdirSync(OUT, { recursive: true });

// Warm cream studio background (#FAF5E8) matches the site's --bg-primary so the
// avatars sit naturally on the card. Square framing; object-fit cover crops to circle.
const BG = 'plain warm cream studio background, soft warm natural lighting, head-and-shoulders, square 1:1 framing, shallow depth of field, no text, no logo';
const personas = [
  {
    file: 'landlord',
    prompt: `Photorealistic editorial headshot portrait of a South Asian man in his mid fifties, an independent property owner, warm and slightly weary but approachable expression, casual button-down shirt. ${BG}.`,
  },
  {
    file: 'property-manager',
    prompt: `Photorealistic editorial headshot portrait of a Black woman in her early forties, a professional property portfolio manager, composed and capable expression, smart business-casual blazer. ${BG}.`,
  },
  {
    file: 'leasing-agent',
    prompt: `Photorealistic editorial headshot portrait of a Latina woman in her mid twenties, an energetic leasing agent, bright friendly expression, polo shirt with a lanyard. ${BG}.`,
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
console.log(`Done: ${ok}/${personas.length}. Next: optimize (sips -Z 512) + add image: "/cases/unitpulse-platform/personas/<file>.png" to each persona in unitpulse-platform.mdx.`);
