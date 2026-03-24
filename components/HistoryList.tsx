import React from 'react';
import { SavedBriefing } from '../types';
import { Trash2, ExternalLink, Calendar, Tag } from 'lucide-react';

interface HistoryListProps {
  items: SavedBriefing[];
  onSelect: (item: SavedBriefing) => void;
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 glass-panel rounded-2xl border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-black">Nog geen geschiedenis</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
          Zodra je een briefing genereert, verschijnt deze hier automatisch.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div 
          key={item.id}
          className="group glass-panel rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#783C96] uppercase tracking-widest mb-1">
                {new Date(item.timestamp).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <h3 className="text-xl font-extrabold text-black leading-tight line-clamp-1">
                {item.input_data.clientName}
              </h3>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              title="Verwijder"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mb-6 flex-grow">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Tag className="w-3 h-3" />
              <span className="font-medium">{item.passport.inferredIndustry || 'Algemeen'}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 italic">
              "{item.input_data.usp}"
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {item.passport.keywords.slice(0, 3).map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onSelect(item)}
            className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
          >
            Bekijk Briefing
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
