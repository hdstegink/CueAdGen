
import React, { useState, useEffect, useRef } from 'react';
import { Duration, UserInput } from '../types';
import { ArrowRight, Beaker, Bookmark, ChevronDown, Zap, Sparkles, Globe, Building2, Users, Calendar, Target, Info, MessageSquare, Volume2, Save, Trash2, X, Check, Wand2 } from 'lucide-react';
import { ACCOUNT_MANAGERS } from '../constants';
import { useAuthToken } from './PasswordGate';

interface Props {
  onSubmit: (data: UserInput) => void;
  isProcessing: boolean;
}

const MONTHS = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni", 
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

const TEST_CASES: (UserInput & { id: string, label: string })[] = [
  {
      id: 'jaap-eden',
      label: 'Jaap Eden IJsbaan',
      url: 'www.jaapeden.nl',
      clientName: 'Jaap Eden IJsbaan',
      payoff: 'De ijsbaan van Amsterdam.',
      usp: 'Schaatsen in de iconische buitenlucht. De leukste winteractiviteit van de stad. Boek nu je tickets voor de 400-meterbaan of de ijshal. Ook voor schaatslessen en gezellige groepsfeestjes.',
      duration: Duration.TwentySeconds,
      month: 'December',
      industry: 'Sport & Recreatie',
      targetAudience: 'Amsterdammers, gezinnen, studenten en schaatsliefhebbers.',
      accountManager: 'Hidde',
      toneOfVoice: 'Energiek & Vrolijk',
      objectives: 'Ticketsverkoop stimuleren voor de kerstvakantie.'
  },
  {
      id: 'monuta',
      label: 'Monuta',
      url: 'www.monuta.nl',
      clientName: 'Monuta',
      payoff: 'De steun bij iedere uitvaart.',
      usp: 'Zorgzame begeleiding bij een afscheid dat past bij de overledene. Transparante kosten en hulp bij het vastleggen van uitvaartwensen. Lokale uitvaartverzorgers die u volledig ontzorgen.',
      duration: Duration.TwentySeconds,
      month: 'Januari',
      industry: 'Uitvaartverzorging',
      targetAudience: 'Mensen die hun uitvaartwensen willen vastleggen of direct hulp nodig hebben bij een overlijden.',
      accountManager: 'Kim',
      toneOfVoice: 'In balans, respectvol & rustig',
      objectives: 'Naamsbekendheid en vertrouwen opbouwen.'
  },
  {
      id: 'van-poelgeest',
      label: 'Van Poelgeest BMW',
      url: 'www.van-poelgeest.nl',
      clientName: 'Van Poelgeest',
      payoff: 'Uw BMW & MINI dealer.',
      usp: 'Ervaar puur rijplezier bij de officiële BMW & MINI dealer. Groot aanbod nieuwe modellen en BMW Premium Selection occasions. Vakkundig onderhoud door gecertificeerde monteurs.',
      duration: Duration.FifteenSeconds,
      month: 'Maart',
      industry: 'Automotive',
      targetAudience: 'Autoliefhebbers, zakelijke rijders en BMW-eigenaren.',
      accountManager: 'Jeremy',
      toneOfVoice: 'Luid, krachtig & premium',
      objectives: 'Testritten aanvragen voor de nieuwe BMW modellen.'
  }
];

const InputForm: React.FC<Props> = ({ onSubmit, isProcessing }) => {
  const authToken = useAuthToken();

  const authFetch = (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`,
      },
    });
  };

  const [formData, setFormData] = useState<UserInput & { preferredModel?: 'pro' | 'flash' }>({
    url: '',
    clientName: '',
    payoff: '',
    usp: '',
    duration: Duration.FifteenSeconds,
    month: new Date().toLocaleString('nl-NL', { month: 'long' }),
    industry: '',
    targetAudience: '',
    accountManager: '',
    toneOfVoice: 'In balans',
    objectives: '',
    preferredModel: 'flash'
  });

  const [customCases, setCustomCases] = useState<(UserInput & { id: string, label: string })[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const saveMenuRef = useRef<HTMLDivElement>(null);
  const loadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTemplates();

    const handleClickOutside = (event: MouseEvent) => {
      if (saveMenuRef.current && !saveMenuRef.current.contains(event.target as Node)) {
        setIsSaving(false);
      }
      if (loadMenuRef.current && !loadMenuRef.current.contains(event.target as Node)) {
        setShowLoadMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await authFetch('/api/templates');
      if (res.ok) {
        const data = await res.json();
        setCustomCases(data.map((item: any) => {
          let label = item.label;
          // Als het nog op [Eigen] staat maar er is een manager bekend, toon die dan
          if (label.startsWith('[Eigen]') && item.data.accountManager) {
            label = label.replace('[Eigen]', `[${item.data.accountManager}]`);
          }
          return {
            ...item.data,
            id: item.id,
            label: label
          };
        }));
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  const handleSaveData = async () => {
    if (!saveName && !formData.clientName) {
      setIsSaving(true);
      return;
    }

    const name = saveName || formData.clientName || "Nieuwe Briefing";
    const id = `template-${Date.now()}`;
    const managerLabel = formData.accountManager ? `[${formData.accountManager}]` : "[Eigen]";

    try {
      const res = await authFetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          label: `${managerLabel} ${name}`,
          data: formData
        })
      });

      if (res.ok) {
        setShowSaveSuccess(true);
        setIsSaving(false);
        setSaveName('');
        fetchTemplates();
        setTimeout(() => setShowSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save template:", err);
    }
  };

  const handleDeleteCase = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const res = await authFetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (err) {
      console.error("Failed to delete template:", err);
    }
  };

  const handleLoadCase = (id: string) => {
    const allCases = [...TEST_CASES, ...customCases];
    const selectedCase = allCases.find(c => c.id === id);
    if (selectedCase) {
      const { id: _, label: __, ...data } = selectedCase;
      setFormData({ ...formData, ...data, preferredModel: formData.preferredModel });
      setShowLoadMenu(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSelectTestCase = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const testCase = TEST_CASES.find(c => c.id === selectedId);
    if (testCase) {
      const { id, label, ...data } = testCase;
      setFormData({ ...formData, ...data, preferredModel: formData.preferredModel });
    }
    e.target.value = "";
  };

  const fieldLabelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5";
  const inputBaseClass = "w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#783C96] focus:ring-2 focus:ring-[#783C96]/10 outline-none transition-all placeholder:text-gray-400 text-sm font-semibold text-gray-900";

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-3xl shadow-2xl relative overflow-hidden border border-white/50">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#783C96] via-[#D23278] to-[#fabb22]"></div>
      
      <div className="p-8 md:p-10">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
          <div>
              <h2 className="text-2xl font-black text-black mb-1">Briefing Detail</h2>
              <p className="text-gray-500 text-sm font-medium">Configureer de campagne parameters voor de AI.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={saveMenuRef}>
              <button
                type="button"
                onClick={() => setIsSaving(!isSaving)}
                className={`flex items-center gap-2 transition-colors px-4 py-2 rounded-full cursor-pointer border ${isSaving ? 'bg-[#783C96] border-[#783C96] text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'} text-[10px] font-bold uppercase tracking-tight`}
              >
                <Save className={`w-3.5 h-3.5 ${isSaving ? 'text-white' : 'text-emerald-500'}`} />
                {showSaveSuccess ? 'Opgeslagen!' : 'Opslaan'}
                {showSaveSuccess && <Check className="w-3 h-3 ml-1" />}
              </button>

              {isSaving && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[60] animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Geef een naam</span>
                    <button onClick={() => setIsSaving(false)} className="text-gray-400 hover:text-black"><X className="w-3 h-3" /></button>
                  </div>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder={formData.clientName || "Naam briefing"}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold mb-3 outline-none focus:border-[#783C96]"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveData()}
                  />
                  <button 
                    onClick={handleSaveData}
                    className="w-full py-2 bg-[#783C96] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#602f7a] transition-colors"
                  >
                    Bevestig Opslaan
                  </button>
                </div>
              )}
            </div>
            <div className="relative" ref={loadMenuRef}>
                <button 
                  type="button"
                  onClick={() => setShowLoadMenu(!showLoadMenu)}
                  className={`flex items-center gap-2 transition-colors px-4 py-2 rounded-full cursor-pointer border ${showLoadMenu ? 'bg-gray-200 border-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'} `}
                >
                    <Beaker className="w-3.5 h-3.5 text-[#783C96]" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Laad gegevens</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showLoadMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showLoadMenu && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-2.5 border-b border-gray-100 flex justify-between items-center">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Selecteer een case</span>
                            <button onClick={() => setShowLoadMenu(false)} className="text-gray-300 hover:text-black transition-colors"><X className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="max-h-72 overflow-y-auto custom-scrollbar">
                            {customCases.length > 0 && (
                                <>
                                    <div className="px-4 pt-3 pb-1">
                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Opgeslagen briefings</span>
                                    </div>
                                    {customCases.map(tc => (
                                        <div 
                                            key={tc.id}
                                            onClick={() => handleLoadCase(tc.id)}
                                            className="mx-2 px-3 py-2.5 hover:bg-[#783C96]/5 flex items-center justify-between group/item transition-all rounded-xl cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-7 h-7 rounded-lg bg-[#783C96]/10 flex items-center justify-center shrink-0">
                                                    <Bookmark className="w-3 h-3 text-[#783C96]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-xs font-bold text-gray-800 truncate block">{tc.label}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => handleDeleteCase(tc.id, e)}
                                                className="opacity-0 group-hover/item:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all shrink-0"
                                            >
                                                <Trash2 className="w-3 h-3 text-red-400" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="h-px bg-gray-100 my-2 mx-4"></div>
                                </>
                            )}
                            <div className="px-4 pt-2 pb-1">
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Democases</span>
                            </div>
                            {TEST_CASES.map(tc => (
                                <div 
                                    key={tc.id}
                                    onClick={() => handleLoadCase(tc.id)}
                                    className="mx-2 px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-all rounded-xl flex items-center gap-2.5"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                        <Beaker className="w-3 h-3 text-gray-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-xs font-semibold text-gray-700 truncate block">{tc.label}</span>
                                        <span className="text-[10px] text-gray-400 truncate block">{tc.industry}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={fieldLabelClass}><Globe className="w-3 h-3" /> Website URL</label>
              <input
                required
                type="text"
                placeholder="bijv. www.dpgmedia.nl"
                className={inputBaseClass}
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div>
              <label className={fieldLabelClass}><Building2 className="w-3 h-3" /> Klantnaam</label>
              <input
                required
                type="text"
                placeholder="Naam adverteerder"
                className={inputBaseClass}
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={fieldLabelClass}><Target className="w-3 h-3" /> Pay-off</label>
              <input
                type="text"
                placeholder="Slogan of pay-off"
                className={inputBaseClass}
                value={formData.payoff || ''}
                onChange={(e) => setFormData({ ...formData, payoff: e.target.value })}
              />
            </div>
            <div>
              <label className={fieldLabelClass}><Info className="w-3 h-3" /> Branche</label>
              <input
                type="text"
                placeholder="bijv. Retail, Automotive"
                className={inputBaseClass}
                value={formData.industry || ''}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className={fieldLabelClass}><Calendar className="w-3 h-3" /> Campagne Maand</label>
              <select
                className={inputBaseClass}
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={fieldLabelClass}><Users className="w-3 h-3" /> Account Manager</label>
              <select
                required
                className={inputBaseClass}
                value={formData.accountManager}
                onChange={(e) => setFormData({ ...formData, accountManager: e.target.value })}
              >
                <option value="" disabled>Selecteer Manager</option>
                {ACCOUNT_MANAGERS.map((am) => <option key={am.name} value={am.name}>{am.name}</option>)}
              </select>
            </div>
            <div>
              <label className={fieldLabelClass}><Zap className="w-3 h-3" /> Lengte Spot</label>
              <select
                className={inputBaseClass}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value as Duration })}
              >
                <option value={Duration.FiveSeconds}>5 seconden</option>
                <option value={Duration.TenSeconds}>10 seconden</option>
                <option value={Duration.FifteenSeconds}>15 seconden</option>
                <option value={Duration.TwentySeconds}>20 seconden</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
             <div>
                <label className={fieldLabelClass}><Volume2 className="w-3 h-3" /> Tone of Voice</label>
                <input
                  type="text"
                  placeholder="bijv. Energiek, luid, in balans, serieus..."
                  className={inputBaseClass}
                  value={formData.toneOfVoice || ''}
                  onChange={(e) => setFormData({ ...formData, toneOfVoice: e.target.value })}
                />
                <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-tight">Omschrijf de gewenste stijl of sfeer</p>
             </div>
             <div>
                <label className={fieldLabelClass}><MessageSquare className="w-3 h-3" /> Doelstellingen</label>
                <input
                  type="text"
                  placeholder="bijv. Showroom traffic, Actie-verkoop"
                  className={inputBaseClass}
                  value={formData.objectives || ''}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                />
                <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-tight">Wat wil je bereiken met deze spot?</p>
             </div>
          </div>

          <div>
            <label className={fieldLabelClass}>Doelgroep Omschrijving</label>
            <input
              type="text"
              placeholder="Wie willen we bereiken?"
              className={inputBaseClass}
              value={formData.targetAudience || ''}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            />
          </div>

          <div>
            <label className={fieldLabelClass}>Unique Selling Points / Kernboodschap</label>
            <textarea
              required
              rows={3}
              placeholder="Wat maakt deze aanbieding uniek? Wat is de actie?"
              className={`${inputBaseClass} resize-none`}
              value={formData.usp}
              onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
            />
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg border border-gray-200 scale-90 md:scale-100">
              <button
                type="button"
                onClick={() => setFormData({...formData, preferredModel: 'flash'})}
                className={`px-3 py-1 rounded-md text-[9px] font-extrabold transition-all flex items-center gap-1 uppercase tracking-tighter ${formData.preferredModel === 'flash' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Zap className="w-2.5 h-2.5 text-yellow-500 fill-current" /> Flash
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, preferredModel: 'pro'})}
                className={`px-3 py-1 rounded-md text-[9px] font-extrabold transition-all flex items-center gap-1 uppercase tracking-tighter ${formData.preferredModel === 'pro' ? 'bg-white shadow-sm text-[#783C96] border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Sparkles className="w-2.5 h-2.5 text-[#D23278] fill-current" /> Pro
              </button>
            </div>

            <div className="relative inline-flex items-center">
              {/* Enhance pill — tucks behind the left side of the main button */}
              <div className="relative z-20" style={{ marginRight: '-2.5rem' }}>
                <button
                  type="button"
                  disabled={isEnhancing || isProcessing || !formData.clientName}
                  onClick={async () => {
                    setIsEnhancing(true);
                    try {
                      const res = await authFetch('/api/enhance', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                      });
                      if (res.ok) {
                        const improved = await res.json();
                        setFormData(prev => ({
                          ...prev,
                          ...(improved.usp && { usp: improved.usp }),
                          ...(improved.industry && { industry: improved.industry }),
                          ...(improved.targetAudience && { targetAudience: improved.targetAudience }),
                          ...(improved.toneOfVoice && { toneOfVoice: improved.toneOfVoice }),
                          ...(improved.objectives && { objectives: improved.objectives }),
                        }));
                      }
                    } catch (e) {
                      console.error('Enhance failed:', e);
                    } finally {
                      setIsEnhancing(false);
                    }
                  }}
                  className={`h-14 pl-5 pr-14 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
                    isEnhancing
                      ? 'bg-[#783C96] text-white border border-[#783C96] animate-pulse'
                      : 'bg-[#783C96]/10 hover:bg-[#783C96]/20 text-[#783C96] border border-[#783C96]/20 hover:border-[#783C96]/40'
                  }`}
                  title="Verbeter briefing met AI"
                >
                  {isEnhancing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Main CTA — sits on top */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`relative z-10 min-w-[220px] h-14 rounded-full font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                  isProcessing
                    ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                    : 'bg-[#783C96] hover:bg-[#602f7a] text-white'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verwerken...
                  </span>
                ) : (
                  <>
                    Schrijf Scripts <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
