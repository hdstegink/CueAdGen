
export enum Duration {
  FiveSeconds = "5s",
  TenSeconds = "10s",
  FifteenSeconds = "15s",
  TwentySeconds = "20s"
}

export type MusicCategory = "Calm" | "Inspirational" | "Regular" | "Happy" | "Stoer";

export type VoiceId = string;

export interface Voice {
  id: VoiceId;
  name: string;
  description: string;
  gender: "Male" | "Female";
  elevenLabsId: string;
}

export const VOICES: Voice[] = [
  { id: "erik", name: "Erik", description: "Heel rustig en veilig", gender: "Male", elevenLabsId: "60CwgZt94Yf7yYIXMDDe" },
  { id: "samuel", name: "Samuel", description: "Fris en jong", gender: "Male", elevenLabsId: "DUhjXXCXHQWckglMUnOv" },
  { id: "rolf", name: "Rolf", description: "Krachtige radiostem", gender: "Male", elevenLabsId: "lyMhRNSScIYS9YRQitfK" },
  { id: "emma", name: "Emma", description: "Warm en zakelijk", gender: "Female", elevenLabsId: "yO6w2xlECAQRFP6pX7Hw" },
  { id: "marjan", name: "Marjan", description: "Heldere vrouwenstem", gender: "Female", elevenLabsId: "46eAUFOjYHnAbq9XpWMc" },
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
  websiteResearch?: string;
  websiteSources?: string[];
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
