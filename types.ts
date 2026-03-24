
export enum Duration {
  FiveSeconds = "5s",
  TenSeconds = "10s",
  FifteenSeconds = "15s",
  TwentySeconds = "20s"
}

export type MusicCategory = "Calm" | "Inspirational" | "Regular" | "Happy" | "Stoer";

export type VoiceId = "erik" | "samuel" | "emma" | "marjan" | "rolf";

export interface Voice {
  id: VoiceId;
  name: string;
  description: string;
  gender: "Male" | "Female";
}

export const VOICES: Voice[] = [
  { id: "erik", name: "Erik", description: "Heel rustig en veilig", gender: "Male" },
  { id: "samuel", name: "Samuel", description: "Fris en jong", gender: "Male" },
  { id: "rolf", name: "Rolf", description: "Krachtige radiostem", gender: "Male" },
  { id: "emma", name: "Emma", description: "Warm en zakelijk", gender: "Female" },
  { id: "marjan", name: "Marjan", description: "Heldere vrouwenstem", gender: "Female" },
];

export interface UserInput {
  url: string;
  clientName: string;
  payoff?: string; 
  usp: string;
  duration: Duration;
  month: string;
  industry?: string; 
  targetAudience?: string; 
  accountManager: string; 
  toneOfVoice?: string; // Veranderd naar string
  objectives?: string;
  voiceId?: VoiceId;
}

export interface BrandPassport {
  toneOfVoice: string; // Veranderd van score naar string
  keywords: string[];
  targetAudience: string;
  seasonalHook: string;
  languageStyle: "Je/Jij" | "U";
  inferredIndustry: string;
  payoff: string;
  musicCategory: MusicCategory;
}

export interface RadioScript {
  type: "Sales-Knaller" | "Branding-Vibe" | "Creatieve Inhaker";
  title: string;
  estimatedDuration: string;
  rationale: string;
  content: string;
  voiceId: VoiceId;
  musicCategory: MusicCategory;
}

export interface RagExample {
  id: string;
  brand: string;
  category: string;
  duration_type: string;
  tags: string[];
  transcript: string;
}

export interface SavedBriefing {
  id: string;
  timestamp: string;
  input_data: UserInput;
  passport: BrandPassport;
  scripts: RadioScript[];
}

export enum AgentStatus {
  Idle = "idle",
  Researching = "researching", 
  Retrieving = "retrieving",   
  Writing = "writing",         
  Completed = "completed",
  Error = "error"
}
