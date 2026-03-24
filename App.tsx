
import { Key, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import PasswordGate from './components/PasswordGate';
import InputForm from './components/InputForm';
import AgentStatusDisplay from './components/AgentStatusDisplay';
import ResultsDisplay from './components/ResultsDisplay';
import { AgentStatus, BrandPassport, RadioScript, UserInput, SavedBriefing } from './types';
import { runResearcherAgent, retrieveRelevantExamples, runCopywriterAgent } from './services/geminiService';
import HistoryList from './components/HistoryList';
import { History, Trash2, Clock } from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.Idle);
  const [passport, setPassport] = useState<BrandPassport | null>(null);
  const [scripts, setScripts] = useState<RadioScript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<UserInput | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [history, setHistory] = useState<SavedBriefing[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/briefings');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const saveBriefing = async (id: string, input: UserInput, passport: BrandPassport, scripts: RadioScript[]) => {
    try {
      const res = await fetch('/api/briefings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, input_data: input, passport, scripts })
      });
      if (res.ok) {
        console.log("Briefing saved to Supabase");
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to save briefing:", err);
    }
  };

  const deleteBriefing = async (id: string) => {
    try {
      await fetch(`/api/briefings/${id}`, { method: 'DELETE' });
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete briefing:", err);
    }
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setIsQuotaError(false);
      setError(null);
    }
  };

  const handleStartWorkflow = async (input: UserInput) => {
    setError(null);
    setIsQuotaError(false);
    setLastInput(input);
    setStatus(AgentStatus.Researching);

    try {
      // Step 1: Agent 1 (Researcher)
      const generatedPassport = await runResearcherAgent(input);
      setPassport(generatedPassport);
      
      // Step 2: RAG Retrieval
      setStatus(AgentStatus.Retrieving);
      await new Promise(r => setTimeout(r, 800)); 
      const relevantExamples = retrieveRelevantExamples(generatedPassport);

      // Step 3: Agent 2 (Copywriter)
      setStatus(AgentStatus.Writing);
      const generatedScripts = await runCopywriterAgent(input, generatedPassport, relevantExamples);
      setScripts(generatedScripts);

      setStatus(AgentStatus.Completed);

      // Save to local DB
      const id = Date.now().toString();
      saveBriefing(id, input, generatedPassport, generatedScripts);

    } catch (err: any) {
      console.error(err);
      const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
      setIsQuotaError(is429);
      setError(err.message || "Er is een fout opgetreden tijdens het genereren.");
      setStatus(AgentStatus.Error);
    }
  };

  const handleRegenerate = async (updatedPassport: BrandPassport) => {
    if (!lastInput) return;
    setPassport(updatedPassport);
    setError(null);
    setIsQuotaError(false);
    setStatus(AgentStatus.Writing);

    try {
      const relevantExamples = retrieveRelevantExamples(updatedPassport);
      const generatedScripts = await runCopywriterAgent(lastInput, updatedPassport, relevantExamples);
      setScripts(generatedScripts);
      setStatus(AgentStatus.Completed);
      
      // Update in local DB
      if (lastInput) {
        const id = Date.now().toString(); // Or keep original ID if we tracked it
        saveBriefing(id, lastInput, updatedPassport, generatedScripts);
      }
    } catch (err: any) {
      console.error(err);
      const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
      setIsQuotaError(is429);
      setError(err.message || "Fout bij het regenereren van scripts.");
      setStatus(AgentStatus.Error);
    }
  };

  const handleReset = () => {
    setStatus(AgentStatus.Idle);
    setPassport(null);
    setScripts([]);
    setError(null);
    setLastInput(null);
    setIsQuotaError(false);
    setShowHistory(false);
  };

  const handleLoadFromHistory = (item: SavedBriefing) => {
    setLastInput(item.input_data);
    setPassport(item.passport);
    setScripts(item.scripts);
    setStatus(AgentStatus.Completed);
    setShowHistory(false);
  };

  return (
    <PasswordGate>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-[#783C96] selection:text-white">
        <div className="fixed inset-0 -z-10 bg-gray-50">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#783C96]/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#fabb22]/15 rounded-full blur-[100px]" />
        </div>

        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="flex items-end gap-1 h-8">
                  <div className="w-2.5 bg-[#783C96] h-6 rounded-t-sm"></div>
                  <div className="w-2.5 bg-[#D23278] h-4 rounded-t-sm"></div>
                  <div className="w-2.5 bg-[#E6463C] h-8 rounded-t-sm"></div>
                  <div className="w-2.5 bg-[#fabb22] h-5 rounded-t-sm"></div>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight text-black leading-none">CUE: AdGen</span>
                  <span className="text-xs font-semibold text-[#783C96] tracking-wide">DPG Media</span>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button 
                 onClick={() => setShowHistory(!showHistory)}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${showHistory ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} text-[10px] font-bold uppercase tracking-wider transition-colors`}
               >
                 <Clock className="w-3 h-3" />
                 Geschiedenis
               </button>
               <div className="hidden sm:block px-4 py-1.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                 BETA v1.2
               </div>
            </div>
          </div>
        </header>

        <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full flex flex-col">
          {error && (
            <div className={`mb-8 glass-panel border-l-4 ${isQuotaError ? 'border-[#fabb22]' : 'border-[#E6463C]'} p-6 rounded-xl shadow-sm animate-shake`}>
              <div className="flex gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isQuotaError ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-black">{isQuotaError ? 'Quota Limiet Bereikt' : 'Er is iets misgegaan'}</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    {isQuotaError 
                      ? "Je hebt het gratis quotum van de AI overschreden. Dit gebeurt vaak bij drukte of intensief gebruik van het Pro-model." 
                      : error}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    {isQuotaError && (
                      <button 
                        onClick={handleOpenKeySelector}
                        className="px-5 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg"
                      >
                        <Key className="w-4 h-4" /> Koppel eigen betaalde key
                      </button>
                    )}
                    <button onClick={handleReset} className="text-sm font-bold text-gray-500 hover:text-black transition-colors underline underline-offset-4">
                      Probeer het opnieuw
                    </button>
                  </div>
                  {isQuotaError && (
                    <p className="mt-4 text-[10px] text-gray-400 font-medium">
                      Tip: Gebruik een key uit een betaald GCP project om limieten te omzeilen. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">Meer info over billing</a>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {status === AgentStatus.Idle && !showHistory && (
            <div className="animate-fade-in-up space-y-8">
              <div className="text-center max-w-3xl mx-auto py-8">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6 leading-tight">
                    Commercials genereren met <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#783C96] to-[#D23278]">snelheid en impact</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                      Vul de URL en klantvraag in. Onze AI analyseert het merk en schrijft direct 3 script-variaties.
                  </p>
              </div>
              <InputForm onSubmit={handleStartWorkflow} isProcessing={false} />
            </div>
          )}

          {showHistory && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-black flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#783C96]" />
                  Eerdere Briefings
                </h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-sm font-bold text-[#783C96] hover:underline"
                >
                  Terug naar Generator
                </button>
              </div>
              <HistoryList 
                items={history} 
                onSelect={handleLoadFromHistory} 
                onDelete={deleteBriefing} 
              />
            </div>
          )}

          {(status === AgentStatus.Researching || status === AgentStatus.Retrieving || status === AgentStatus.Writing) && (
             <div className="flex-grow flex flex-col items-center justify-center min-h-[50vh]">
                <AgentStatusDisplay status={status} />
             </div>
          )}

          {status === AgentStatus.Completed && passport && lastInput && (
            <div className="animate-fade-in">
               <ResultsDisplay 
                  passport={passport} 
                  scripts={scripts}
                  inputData={lastInput}
                  onReset={handleReset} 
                  onRegenerate={handleRegenerate}
               />
            </div>
          )}
        </main>

        <footer className="mt-auto py-8 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">2026 DPG Media - Internal Use Only</p>
          </div>
        </footer>
      </div>
    </PasswordGate>
  );
};

export default App;
