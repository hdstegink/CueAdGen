
import OpenAI from "openai";
import { BrandPassport, RagExample, UserInput, RadioScript } from '../types.js';
import { RAG_DATASET } from '../constants.js';

/**
 * Hulpfunctie voor exponentiële backoff bij API-fouten
 */
const fetchWithRetry = async (fn: () => Promise<any>, retries = 2, delay = 1000): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    const is429 = error.status === 429 || error.message?.includes('429') || error.message?.includes('rate_limit');
    if (retries > 0 && is429) {
      console.warn(`[OpenAI] Rate limit bereikt. Retry in ${delay}ms... (${retries} pogingen over)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

const isBrowser = typeof window !== 'undefined';
const getClient = () => new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.API_KEY,
  dangerouslyAllowBrowser: isBrowser,
});

export const retrieveRelevantExamples = (passport: BrandPassport): RagExample[] => {
  const scoredExamples = RAG_DATASET.map(example => {
    let score = 0;
    if (example.category.toLowerCase() === passport.inferredIndustry.toLowerCase()) {
      score += 10;
    }
    passport.keywords.forEach(kw => {
      if (example.tags.some(tag => tag.toLowerCase().includes(kw.toLowerCase()))) {
        score += 3;
      }
    });
    return { ...example, score };
  });

  return scoredExamples.sort((a, b) => b.score - a.score).slice(0, 3);
};

export const runResearcherAgent = async (input: UserInput): Promise<BrandPassport> => {
  console.log(`[Agent:Researcher] Analyseert ${input.url}...`);

  return fetchWithRetry(async () => {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Je bent een Senior Brand Strategist voor DPG Media. Analyseer de website en briefing om een Brand DNA paspoort te maken.

Je antwoord MOET exact dit JSON-formaat hebben:
{
  "toneOfVoice": "string - omschrijving van de tone of voice",
  "keywords": ["string", "string", "string"] - 3 adjectieven die de merkstijl beschrijven,
  "targetAudience": "string - beschrijving doelgroep in 1 zin",
  "seasonalHook": "string - seizoensgebonden haakje",
  "languageStyle": "Je/Jij" of "U",
  "inferredIndustry": "string - de branche",
  "payoff": "string - de slogan of pay-off",
  "musicCategory": "Calm" of "Inspirational" of "Regular" of "Happy" of "Stoer"
}

RICHTLIJNEN VOOR AUDIO & TONE:
1. toneOfVoice: Omschrijf de tone of voice in enkele kernwoorden.
2. musicCategory: Kies de BESTE match uit deze 5 DPG Audio Bedden:
   - "Calm": Rustig, dromerig.
   - "Inspirational": Groots, hoopvol.
   - "Regular": Toegankelijk, vakantie-vibe.
   - "Happy": Vrolijk, up-tempo.
   - "Stoer": Krachtig, automotive, bouw.`
        },
        {
          role: "user",
          content: `Analyseer het volgende:
* **URL:** ${input.url}
* **Maand:** ${input.month}
* **Branche:** ${input.industry || "Bepaal o.b.v. URL"}
* **Doelgroep:** ${input.targetAudience || "Niet specifiek opgegeven"}
* **Gewenste Tone of Voice:** ${input.toneOfVoice || "In balans"}
* **Pay-off/Slogan:** ${input.payoff || "Niet opgegeven, bepaal zelf op basis van analyse"}

BELANGRIJK: Als er een pay-off is opgegeven, neem deze dan LETTERLIJK over in het "payoff" veld. Verzin GEEN alternatieve slogan.`
        }
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text.trim()) as BrandPassport;
  });
};

export const runCopywriterAgent = async (
  input: UserInput,
  passport: BrandPassport,
  examples: RagExample[]
): Promise<RadioScript[]> => {
  const modelToUse = (input as any).preferredModel === 'pro' ? 'gpt-4o' : 'gpt-4o-mini';
  
  console.log(`[Agent:Copywriter] Gebruikt model: ${modelToUse} voor ${input.clientName}...`);

  const examplesText = examples.map(ex => 
    `- Merk: ${ex.brand}\n  Script: "${ex.transcript}"`
  ).join("\n\n");

  return fetchWithRetry(async () => {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: modelToUse,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Je bent Senior Creative Lead van Radio Van DPG Media. Schrijf 3 bekroonde radiocommercials.

ZEER BELANGRIJK: GEEN SFX
Gebruik GEEN geluidseffecten of tags zoals [SFX: ...], [FX: ...] of [Muziek: ...] in de scripttekst. 
Lever PUUR de gesproken tekst aan. De audio-bedden en pingels worden automatisch toegevoegd.

STEMKEUZE (voiceId) - Maak een bewuste keuze:
- 'erik': Heel rustig en veilig (Man)
- 'samuel': Fris en jong (Man)
- 'rolf': Krachtige radiostem (Man)
- 'emma': Warm en zakelijk (Vrouw)
- 'marjan': Heldere vrouwenstem (Vrouw)

Je antwoord MOET exact dit JSON-formaat hebben:
{
  "scripts": [
    {
      "type": "Sales-Knaller" of "Branding-Vibe" of "Creatieve Inhaker",
      "title": "string",
      "estimatedDuration": "string",
      "rationale": "string",
      "content": "string - alleen de gesproken tekst, geen SFX of tags",
      "voiceId": "erik" of "samuel" of "emma" of "marjan" of "rolf",
      "musicCategory": "Calm" of "Inspirational" of "Regular" of "Happy" of "Stoer"
    }
  ]
}

Schrijf 3 scripts: Sales-Knaller, Branding-Vibe en Creatieve Inhaker.
Zorg dat de tekst 100% spreektaal is zonder regie-aanwijzingen.

RADIO CREATIEVE WETTEN:

1. FOCUS — Max 1-2 boodschappen per spot.
   Probeer niet alles te zeggen. Kies 1 kernboodschap en 1 call-to-action. Minder = meer impact.

2. STERKE CTA — Vooral bij Sales-Knaller: eindig met een concrete, actiegerichte oproep.
   Bijvoorbeeld: "Ga nu naar [website]", "Kijk op [website]", "Bel nu [nummer]".
   Bij Branding-Vibe mag de CTA zachter zijn (bijv. "Ontdek meer op...").

3. MERKNAAM VROEG & VAAK:
   - Noem de merknaam al in de eerste zin of zo vroeg mogelijk voor directe herkenning.
   - Bij spots langer dan 10 seconden: de merknaam moet MINSTENS 2 keer voorkomen.
   - Sluit ALTIJD af met de merknaam OF de website.
   - Als de merknaam al in de pay-off zit, telt dat mee en hoeft de naam niet extra herhaald.

4. HERHAAL DE KERNBOODSCHAP — De USP of het belangrijkste voordeel moet niet slechts 1x genoemd worden.
   Herhaal het op een natuurlijke manier (in andere woorden of in de afsluiter) voor top-of-mind effect.

5. RUIMTE & RUST — Prop niet te veel tekst in de spot.
   Laat ademruimte. Korte zinnen. Pauzes doen het werk.
   Dit geldt EXTRA bij Branding-Vibe: hier draait het om sfeer, niet om snelheid.

6. PER SCRIPTTYPE:
   - Sales-Knaller: Direct, actiegericht, sterke CTA, USP centraal. Mag sneller en punchier.
   - Branding-Vibe: Emotie en beleving centraal. Positieve associaties. Minder harde sales, meer sfeer en gevoel. Meer rust in het script.
   - Creatieve Inhaker: Verrassend, slim, speels. Haak in op het seizoen of de actualiteit.

7. WOORDAANTAL & DUUR — Vul de gevraagde spotlengte volledig.
   Reken met ca. 2,5 woorden per seconde voor natuurlijke Nederlandse radiospeech:
   - 10 seconden ≈ 25 woorden
   - 15 seconden ≈ 37-40 woorden
   - 20 seconden ≈ 50 woorden
   - 30 seconden ≈ 75 woorden
   Schrijf NIET te weinig tekst. De spot moet de volledige duur vullen zonder gehaast te klinken.`
        },
        {
          role: "user",
          content: `Schrijf 3 radiocommercials voor:
* **Klant:** ${input.clientName}
* **USP:** ${input.usp}
* **Pay-off/Slogan:** ${passport.payoff}
* **Tone of Voice:** ${passport.toneOfVoice}
* **Lengte:** ${input.duration}
* **Brand DNA:** ${JSON.stringify(passport)}
* **Inspiratie-voorbeelden:**
${examplesText}

BELANGRIJK: De pay-off "${passport.payoff}" is vastgesteld door de klant. Gebruik deze EXACT en LETTERLIJK in de scripts. Verzin GEEN andere slogan of pay-off.`
        }
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Empty response from AI");
    const json = JSON.parse(text.trim());
    return json.scripts as RadioScript[];
  });
};

export const enhanceBriefing = async (input: UserInput): Promise<Partial<UserInput>> => {
  console.log(`[Agent:Enhancer] Verbetert briefing voor ${input.clientName}...`);

  return fetchWithRetry(async () => {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Je bent een senior radio-strateeg bij DPG Media. Een accountmanager heeft een briefing ingevuld voor een radiocommercial, maar de input kan beter.

Jouw taak: verbeter en verrijk de ingevulde velden zodat ze scherper, concreter en bruikbaarder zijn voor het schrijven van een radiospot.

REGELS:
- Blijf TROUW aan wat de accountmanager bedoelde. Verzin geen nieuwe richting.
- Maak vage omschrijvingen concreter en specifieker.
- Vul aan waar nodig, maar overdrijf niet.
- Schrijf in het Nederlands, kort en bondig.

VELDEN DIE JE MAG VERBETEREN:
- "usp": Maak de USP concreter, scherper, meer to-the-point. Voeg specifieke voordelen/feiten toe als die logisch zijn.
- "industry": Verfijn de branche-omschrijving als die vaag of te breed is.
- "targetAudience": Maak de doelgroep specifieker (leeftijd, interesses, context).
- "toneOfVoice": Verfijn de toon als die vaag is (bijv. "normaal" → "Toegankelijk & warm").
- "objectives": Maak doelstellingen concreter en actiegerichter.

VELDEN DIE JE NIET MAG WIJZIGEN (geef ze ook NIET terug):
- url, clientName, payoff, duration, month, accountManager

Je antwoord MOET exact dit JSON-formaat hebben:
{
  "usp": "verbeterde USP tekst",
  "industry": "verbeterde branche",
  "targetAudience": "verbeterde doelgroep",
  "toneOfVoice": "verbeterde tone of voice",
  "objectives": "verbeterde doelstellingen"
}

Als een veld al goed is, geef het dan ongewijzigd terug.`
        },
        {
          role: "user",
          content: `Verbeter deze briefing:
* **Klant:** ${input.clientName}
* **Website:** ${input.url}
* **Pay-off:** ${input.payoff || "Niet opgegeven"}
* **USP:** ${input.usp || "Niet ingevuld"}
* **Branche:** ${input.industry || "Niet ingevuld"}
* **Doelgroep:** ${input.targetAudience || "Niet ingevuld"}
* **Tone of Voice:** ${input.toneOfVoice || "Niet ingevuld"}
* **Doelstellingen:** ${input.objectives || "Niet ingevuld"}
* **Spotlengte:** ${input.duration}
* **Maand:** ${input.month}`
        }
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text.trim()) as Partial<UserInput>;
  });
};
