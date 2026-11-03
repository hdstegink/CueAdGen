<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/58d7bac2-160c-41d4-87cc-07773f12e6a5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## ElevenLabs testvoices

Spraak wordt gegenereerd met `eleven_v4`. Voeg een teststem toe aan `VOICES` in [types.ts](types.ts):

```ts
{ id: "teststem-1", name: "Teststem 1", description: "Korte omschrijving", gender: "Female", elevenLabsId: "PLAK_HIER_DE_VOICE_ID" },
```

Gebruik een unieke `id` voor de interne keuze en de Voice ID uit de ElevenLabs Voice Library als `elevenLabsId`. De stem verschijnt daarna in de stemkeuze bij elk script, zodat je verschillende ID's direct kunt vergelijken. De API-key blijft in `ELEVENLABS_API_KEY` op de server; deel of commit die niet.
