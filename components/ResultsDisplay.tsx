
import React, { useState, useEffect, useRef } from 'react';
import { BrandPassport, RadioScript, UserInput, MusicCategory, VOICES, VoiceId } from '../types';
import { Copy, Music, Zap, Hash, Calendar, Megaphone, UserCircle, RefreshCw, Play, Square, Loader2, Mic, Mail, X, Send, Check, Volume2, ChevronDown, Info } from 'lucide-react';
import { produceRadioSpot, SpotAssets } from '../services/audioProductionService';
import { createSpotPlayer, SpotPlayer } from '../services/rendiService';
import { sendPostmarkEmail } from '../services/postmarkService';
import { ACCOUNT_MANAGERS } from '../constants';

interface Props {
  passport: BrandPassport;
  scripts: RadioScript[];
  inputData: UserInput;
  onReset: () => void;
  onRegenerate: (updatedPassport: BrandPassport) => void;
}

const ResultsDisplay: React.FC<Props> = ({ passport, scripts, inputData, onReset, onRegenerate }) => {
  const [editedPassport, setEditedPassport] = useState<BrandPassport>(passport);
  const [isDirty, setIsDirty] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const [selectedVoices, setSelectedVoices] = useState<VoiceId[]>([]);
  const [playingScriptIndex, setPlayingScriptIndex] = useState<number | null>(null);
  const [audioCache, setAudioCache] = useState<{[key: number]: SpotAssets}>({});
  const [loadingIndices, setLoadingIndices] = useState<Set<number>>(new Set());
  
  const [isMailing, setIsMailing] = useState(false);
  const [isMailed, setIsMailed] = useState(false);
  const [openVoiceSelector, setOpenVoiceSelector] = useState<number | null>(null);
  const [editedScripts, setEditedScripts] = useState<string[]>([]);
  const [showFormattingTips, setShowFormattingTips] = useState<number | null>(null);
  
  const playerRef = useRef<SpotPlayer | null>(null);

  useEffect(() => {
    setEditedPassport(passport);
    setIsDirty(false);
    setIsRegenerating(false);
    setSelectedVoices(scripts.map(s => s.voiceId || inputData.voiceId || 'erik'));
    setEditedScripts(scripts.map(s => s.content));
    stopAudio();
    setAudioCache({});
    setLoadingIndices(new Set());
    setIsMailed(false);
  }, [passport, scripts]);

  const stopAudio = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current = null;
    }
    setPlayingScriptIndex(null);
  };

  const handleVoiceChange = (index: number, newVoiceId: VoiceId) => {
    if (selectedVoices[index] === newVoiceId) {
        setOpenVoiceSelector(null);
        return;
    }
    if (playingScriptIndex === index) stopAudio();
    setSelectedVoices(prev => {
        const next = [...prev];
        next[index] = newVoiceId;
        return next;
    });
    setAudioCache(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
    });
    setOpenVoiceSelector(null);
  };

  const handleScriptChange = (index: number, newContent: string) => {
    setEditedScripts(prev => {
      const next = [...prev];
      next[index] = newContent;
      return next;
    });
    // Clear audio cache for this script since content changed
    setAudioCache(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const calculatePlaybackRate = (musicCategory: MusicCategory, toneOfVoice: string) => {
    const tone = toneOfVoice.toLowerCase();
    const cat = musicCategory.toLowerCase();
    
    if (tone.includes('energiek') || tone.includes('luid') || tone.includes('krachtig') || tone.includes('enthousiast') || cat === 'happy' || cat === 'stoer') {
      return 1.1;
    }
    
    if (tone.includes('rustig') || tone.includes('kalm') || tone.includes('serieus') || cat === 'calm') {
      return 1.0;
    }

    return 1.05;
  };

  const handlePlayAudio = async (index: number, content: string) => {
    const voiceId = selectedVoices[index] || scripts[index]?.voiceId || inputData.voiceId || 'erik';
    
    if (playingScriptIndex === index) {
      stopAudio();
      return;
    }
    
    if (playingScriptIndex !== null) stopAudio();

    if (!content || !content.trim()) {
      alert("Voer eerst wat tekst in.");
      return;
    }

    if (!scripts[index]) return;

    const speed = calculatePlaybackRate(scripts[index].musicCategory, editedPassport.toneOfVoice);

    let spotAssets = audioCache[index];
    if (!spotAssets) {
      try {
          setLoadingIndices(prev => new Set(prev).add(index));
          const script = scripts[index];
          spotAssets = await produceRadioSpot(content, voiceId, script.musicCategory, editedPassport.toneOfVoice);
          setAudioCache(prev => ({ ...prev, [index]: spotAssets! }));
      } catch (err) {
          console.error("Audio generation failed", err);
          alert("Audio kon niet worden gegenereerd.");
          return;
      } finally {
          setLoadingIndices(prev => {
              const next = new Set(prev);
              next.delete(index);
              return next;
          });
      }
    }

    const player = createSpotPlayer(spotAssets, speed);
    playerRef.current = player;
    setPlayingScriptIndex(index);
    player.onEnded(() => {
      setPlayingScriptIndex(null);
      playerRef.current = null;
    });
    player.play();
  };

  const handleSendAllEmail = async () => {
    const am = ACCOUNT_MANAGERS.find(a => a.name === inputData.accountManager);
    if (!am) {
        alert("Geen account manager gevonden.");
        return;
    }

    setIsMailing(true);

    try {
        const scriptsHtml = scripts.map((script, idx) => {
            const voice = VOICES.find(v => v.id === selectedVoices[idx]);
            return `
            <div style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                <h3 style="color: #D23278; margin-bottom: 5px;">Optie ${idx + 1}: ${script.title} (${script.type})</h3>
                <p style="font-style: italic; color: #666; font-size: 13px; margin-top: 0;">Duur: ${script.estimatedDuration} | Voice: ${voice?.name} (${voice?.description}) | Bedje: ${script.musicCategory}</p>
                
                <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #fabb22; font-size: 16px; line-height: 1.6; font-family: monospace;">
                    ${script.content.replace(/\n/g, '<br>')}
                </div>
                
                <p style="font-size: 14px; color: #444; margin-top: 15px;"><strong>Rationale:</strong> ${script.rationale}</p>
            </div>
        `}).join('');

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #eee; padding: 30px; color: #333;">
                <div style="text-align: center; margin-bottom: 25px;">
                  <h2 style="color: #783C96; margin-bottom: 5px;">Nieuwe AI Radio Scripts</h2>
                  <p style="color: #666; margin-top: 0;">Campagne voor: <strong>${inputData.clientName}</strong></p>
                </div>

                <p>Hoi ${am.name},</p>
                <p>Ik heb met CUE: AdGen een aantal radio scripts gegenereerd voor <strong>${inputData.clientName}</strong>. Hieronder vind je de drie voorgestelde richtingen.</p>
                
                <div style="background: #f4f0f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #783C96; margin-top: 0; margin-bottom: 10px;">Brand DNA Context:</h4>
                    <ul style="font-size: 13px; margin: 0; padding-left: 20px;">
                        <li><strong>Tone:</strong> ${editedPassport.toneOfVoice}</li>
                        <li><strong>Pay-off:</strong> ${editedPassport.payoff}</li>
                        <li><strong>Doelgroep:</strong> ${editedPassport.targetAudience}</li>
                    </ul>
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
                
                ${scriptsHtml}
                
                <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">Gegenereerd door CUE: AdGen — DPG Media.</p>
            </div>
        `;

        await sendPostmarkEmail({
            to: am.email,
            bcc: 'hidde.stegink@persgroep.net', // BCC Hidde for testing/verification
            subject: `[CUE: AdGen] Scripts: ${inputData.clientName} (${scripts.length} opties)`,
            htmlBody
        });

        setIsMailed(true);
    } catch (err: any) {
        console.error("Email failed", err);
        alert(`Email kon niet worden verzonden: ${err.message || 'Onbekende fout'}`);
    } finally {
        setIsMailing(false);
    }
  };

  const handleInputChange = (field: keyof BrandPassport, value: any) => {
    setEditedPassport(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setAudioCache({});
  };

  const handleKeywordChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim());
    setEditedPassport(prev => ({ ...prev, keywords }));
    setIsDirty(true);
  };

  const handleRegenerateClick = () => {
    setIsRegenerating(true);
    onRegenerate(editedPassport);
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const inputContainerClass = "bg-gray-50 p-4 rounded-xl border border-transparent focus-within:ring-2 focus-within:ring-[#783C96]/20 focus-within:border-[#783C96] transition-all flex flex-col group cursor-text";
  const labelClass = "text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5 group-focus-within:text-[#783C96] transition-colors";
  const inputClass = "w-full bg-transparent border-none outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400 p-0";
  const textAreaClass = "w-full bg-transparent border-none outline-none text-sm font-bold text-gray-900 leading-relaxed resize-none placeholder:text-gray-400 p-0";

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-8 relative">
      <div className="xl:col-span-4 space-y-6">
        <div className="glass-panel rounded-2xl overflow-hidden shadow-lg shadow-purple-900/5">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#783C96] via-[#D23278] to-[#fabb22]"></div>
          <div className="bg-[#783C96] px-6 py-4 flex items-center justify-between">
            <h3 className="text-white font-bold flex items-center gap-2 text-lg"><Zap className="w-5 h-5 fill-current" /> Brand DNA</h3>
            {isDirty && <span className="text-[10px] bg-white text-[#783C96] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide animate-pulse">Aangepast</span>}
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <div className={inputContainerClass}>
                <label className={labelClass}><Volume2 className="w-3.5 h-3.5" /> Tone of Voice</label>
                <input 
                  type="text" 
                  className={inputClass} 
                  value={editedPassport.toneOfVoice} 
                  onChange={(e) => handleInputChange('toneOfVoice', e.target.value)} 
                />
              </div>
              <div className={inputContainerClass}><label className={labelClass}><Hash className="w-3.5 h-3.5" /> Kernwoorden</label><input type="text" className={inputClass} value={editedPassport.keywords.join(', ')} onChange={(e) => handleKeywordChange(e.target.value)} /></div>
              <div className={inputContainerClass}><label className={labelClass}><Megaphone className="w-3.5 h-3.5" /> Pay-off</label><input type="text" className={inputClass} value={editedPassport.payoff} onChange={(e) => handleInputChange('payoff', e.target.value)} /></div>
              <div className={inputContainerClass}><label className={labelClass}><UserCircle className="w-3.5 h-3.5" /> Doelgroep</label><textarea rows={3} className={textAreaClass} value={editedPassport.targetAudience} onChange={(e) => handleInputChange('targetAudience', e.target.value)} /></div>
              <div className={inputContainerClass}><label className={labelClass}><Calendar className="w-3.5 h-3.5" /> Haakje</label><textarea rows={2} className={textAreaClass} value={editedPassport.seasonalHook} onChange={(e) => handleInputChange('seasonalHook', e.target.value)} /></div>
              <div className={inputContainerClass}>
                <label className={labelClass}><Music className="w-3.5 h-3.5" /> Muziekstijl</label>
                <select 
                  className={inputClass} 
                  value={editedPassport.musicCategory} 
                  onChange={(e) => handleInputChange('musicCategory', e.target.value as MusicCategory)}
                >
                  <option value="Calm">Calm</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Regular">Regular</option>
                  <option value="Happy">Happy</option>
                  <option value="Stoer">Stoer</option>
                </select>
              </div>
            </div>

            <div className="pt-2 space-y-3">
                <button 
                  onClick={handleRegenerateClick} 
                  disabled={isRegenerating} 
                  className={`w-full py-3 rounded-lg font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 ${isRegenerating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#D23278] hover:bg-[#b02260] text-white hover:shadow-lg'}`}
                >
                    {isRegenerating ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Bezig...</span> : <><RefreshCw className="w-4 h-4" /> Herbereken & Herschrijf</>}
                </button>

                <button 
                  onClick={handleSendAllEmail} 
                  disabled={isMailing || isMailed} 
                  className={`w-full py-3 rounded-lg font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 ${isMailed ? 'bg-green-500 text-white cursor-default' : isMailing ? 'bg-gray-200 text-gray-400' : 'bg-[#783C96] hover:bg-[#602f7a] text-white'}`}
                >
                    {isMailing ? <Loader2 className="w-4 h-4 animate-spin" /> : isMailed ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    {isMailed ? 'E-mail Verzonden' : `Mail naar ${inputData.accountManager}`}
                </button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
             <button onClick={onReset} className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-white hover:border-gray-400 hover:text-black transition-all">Start Nieuwe Briefing</button>
        </div>
      </div>

      <div className="xl:col-span-8 space-y-8">
        <h2 className="text-3xl font-extrabold text-black">Gegenereerde Scripts</h2>
        {scripts.map((script, idx) => {
          const isPlaying = playingScriptIndex === idx;
          const isLoading = loadingIndices.has(idx);
          const displayContent = script.content;

          return (
            <div key={idx} className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-300 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#783C96] via-[#D23278] to-[#fabb22]"></div>
                <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${script.type === 'Sales-Knaller' ? 'bg-[#E6463C]/10 text-[#E6463C]' : script.type === 'Branding-Vibe' ? 'bg-[#783C96]/10 text-[#783C96]' : 'bg-[#fabb22]/20 text-yellow-700'}`}>{script.type}</span>
                            <span className="text-xs font-bold text-gray-500 flex items-center gap-1 border border-gray-200 px-2 py-0.5 rounded-full bg-white tracking-tight"><Music className="w-3.5 h-3.5" /> {script.estimatedDuration}</span>
                        </div>
                        <h3 className="text-xl font-bold text-black">{script.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <div className="relative min-w-[200px]">
                            <button 
                                onClick={() => setOpenVoiceSelector(openVoiceSelector === idx ? null : idx)}
                                className={`flex items-center justify-between w-full px-4 py-2 bg-white border rounded-lg transition-all shadow-sm ${
                                    openVoiceSelector === idx ? 'border-[#783C96] ring-2 ring-[#783C96]/10' : 'border-gray-300 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <Mic className="w-4 h-4 text-[#783C96]" />
                                    <div className="flex items-center gap-2 text-left overflow-hidden">
                                        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                            {VOICES.find(v => v.id === selectedVoices[idx])?.name}
                                        </span>
                                        <span className="text-gray-300 font-light">|</span>
                                        <span className="text-[11px] text-gray-500 font-medium truncate">
                                            {VOICES.find(v => v.id === selectedVoices[idx])?.description}
                                        </span>
                                    </div>
                                </div>
                                <ChevronDown className={`flex-shrink-0 w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ml-2 ${openVoiceSelector === idx ? 'rotate-180' : ''}`} />
                            </button>

                            {openVoiceSelector === idx && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setOpenVoiceSelector(null)} />
                                    <div className="absolute z-20 right-0 mt-2 p-2 bg-white border border-gray-200 rounded-xl shadow-2xl w-[320px] grid grid-cols-1 gap-1 animate-in fade-in zoom-in-95 duration-200">
                                        {VOICES.map(v => (
                                          <button
                                            key={v.id}
                                            onClick={() => handleVoiceChange(idx, v.id)}
                                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                                              selectedVoices[idx] === v.id 
                                                ? 'border-[#783C96] bg-purple-50' 
                                                : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                            }`}
                                          >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#783C96]">
                                                <Mic className="w-4 h-4" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                  <span className={`text-sm font-bold truncate ${selectedVoices[idx] === v.id ? 'text-[#783C96]' : 'text-gray-900'}`}>{v.name}</span>
                                                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                                                    selectedVoices[idx] === v.id ? 'bg-[#783C96] text-white' : 'bg-gray-200 text-gray-500'
                                                  }`}>
                                                    {v.gender === 'Male' ? 'Man' : 'Vrouw'}
                                                  </span>
                                                </div>
                                                <p className={`text-[10px] leading-tight truncate ${
                                                  selectedVoices[idx] === v.id ? 'text-purple-700' : 'text-gray-500'
                                                }`}>{v.description}</p>
                                            </div>
                                          </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <button 
                            onClick={() => setShowFormattingTips(showFormattingTips === idx ? null : idx)}
                            className="p-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:text-[#783C96] hover:border-[#783C96] transition-all"
                            title="ElevenLabs Formatting Tips"
                        >
                            <Info className="w-4 h-4" />
                        </button>
                        <button onClick={() => handlePlayAudio(idx, editedScripts[idx] || script.content)} disabled={isLoading} className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all border min-w-[120px] justify-center ${isPlaying ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-white border-gray-300 text-gray-700 hover:border-[#783C96] hover:text-[#783C96] hover:bg-purple-50'}`}>
                            {isLoading ? <span className="flex items-center gap-2 text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /> Laden...</span> : isPlaying ? <><Square className="w-4 h-4 fill-current" /> Stop</> : <><Play className="w-4 h-4 fill-current" /> Luister</>}
                        </button>
                        <button onClick={() => copyToClipboard(editedScripts[idx] || script.content)} className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold text-sm hover:border-gray-400 hover:text-black transition-colors"><Copy className="w-4 h-4" /> Kopiëren</button>
                    </div>
                </div>
                <div className="p-8">
                    <div className="mb-6 flex gap-3"><div className="w-1 bg-[#fabb22] rounded-full shrink-0"></div><p className="text-sm text-gray-700"><span className="font-bold text-gray-900 mr-1">Waarom dit werkt:</span>{script.rationale}</p></div>
                    
                    {showFormattingTips === idx && (
                        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                    <Info className="w-4 h-4" /> ElevenLabs Formatting Tips
                                </h4>
                                <button onClick={() => setShowFormattingTips(null)} className="text-blue-400 hover:text-blue-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed text-blue-800">
                                <div>
                                    <p className="font-bold mb-1">1. Gebruik van Leestekens</p>
                                    <ul className="space-y-1 list-disc pl-4">
                                        <li><strong>Komma ( , ):</strong> Korte, natuurlijke adempauze.</li>
                                        <li><strong>Punt ( . ) / ( ! ):</strong> Duidelijke stop einde zin.</li>
                                        <li><strong>Beletselteken ( ... ):</strong> Lichte vertraging of aarzeling.</li>
                                        <li><strong>Dubbele koppeltekens ( -- ):</strong> Abruptere pauze.</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-bold mb-1">2. De "Dash" Methode</p>
                                    <p>Voor meer controle: gebruik meerdere koppeltekens achter elkaar.</p>
                                    <p className="mt-1 italic bg-blue-100/50 p-1.5 rounded">
                                        "Dit is een zin. --- En nu een langere pauze."
                                    </p>
                                    <p className="mt-1 opacity-70">Hoe meer streepjes, hoe langer de stilte.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`bg-gray-900 rounded-xl p-8 relative overflow-hidden group transition-all duration-500 ${isPlaying ? 'ring-4 ring-[#783C96]/30' : ''}`}>
                        {isPlaying && <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"><div className="heartbeat-bar w-2 bg-white mx-1" style={{animationDelay: '0s'}}></div><div className="heartbeat-bar w-2 bg-white mx-1" style={{animationDelay: '0.2s'}}></div><div className="heartbeat-bar w-2 bg-white mx-1" style={{animationDelay: '0.4s'}}></div></div>}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <textarea 
                            value={editedScripts[idx] ?? script.content}
                            onChange={(e) => handleScriptChange(idx, e.target.value)}
                            className="w-full bg-transparent border-none outline-none font-mono text-lg text-white leading-loose whitespace-pre-wrap relative z-10 font-bold resize-none min-h-[200px] focus:ring-0 p-0"
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsDisplay;
