import React from 'react';
import { DGEDAN_CATEGORIES, DiplomaticCategory, PressArticle } from '../types';
import {
  Building2,
  Scale,
  Newspaper,
  GraduationCap,
  Megaphone,
  UserCheck,
  Vote,
  Flag,
  Users,
  Plane,
  MailOpen,
  Globe,
  ShieldAlert,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: number | 'all';
  onSelectCategory: (id: number | 'all') => void;
  articles: PressArticle[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  articles,
}) => {
  // Count articles per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<number, number> = {};
    articles.forEach((art) => {
      art.categoryIds.forEach((catId) => {
        counts[catId] = (counts[catId] || 0) + 1;
      });
    });
    return counts;
  }, [articles]);

  const getCategoryIcon = (id: number) => {
    switch (id) {
      case 1: return <Building2 className="w-3.5 h-3.5" />;
      case 2: return <Scale className="w-3.5 h-3.5" />;
      case 3: return <Newspaper className="w-3.5 h-3.5" />;
      case 4: return <GraduationCap className="w-3.5 h-3.5" />;
      case 5: return <Megaphone className="w-3.5 h-3.5" />;
      case 6: return <UserCheck className="w-3.5 h-3.5" />;
      case 7: return <Vote className="w-3.5 h-3.5" />;
      case 8: return <Flag className="w-3.5 h-3.5" />;
      case 9: return <Users className="w-3.5 h-3.5" />;
      case 10: return <Plane className="w-3.5 h-3.5" />;
      case 11: return <MailOpen className="w-3.5 h-3.5" />;
      case 12: return <Globe className="w-3.5 h-3.5" />;
      case 13: return <ShieldAlert className="w-3.5 h-3.5" />;
      default: return <SlidersHorizontal className="w-3.5 h-3.5" />;
    }
  };

  const selectedCategoryObj = selectedCategory === 'all'
    ? null
    : DGEDAN_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0c2340]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
            Ejes Temáticos Prioritarios DGEDAN (13 Categorías SRE)
          </h2>
        </div>
        <span className="text-[10px] text-[#94a3b8] font-mono uppercase tracking-wider hidden sm:inline">
          Circunscripción Norte de Texas
        </span>
      </div>

      {/* Horizontal pill list of categories */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          id="btn-cat-all"
          onClick={() => onSelectCategory('all')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#0c2340] text-white shadow-xs'
              : 'bg-slate-100 text-[#475569] hover:bg-slate-200 border border-[#cbd5e1]'
          }`}
        >
          <span>Todos los Ejes</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
            selectedCategory === 'all' ? 'bg-[#1e3a5f] text-[#b5a269]' : 'bg-slate-200 text-slate-700'
          }`}>
            {articles.length}
          </span>
        </button>

        {DGEDAN_CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`btn-cat-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              title={cat.shortDescription}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                isSelected
                  ? 'bg-[#00472e] text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-[#475569] hover:bg-slate-100 border border-[#cbd5e1]'
              }`}
            >
              <span className={isSelected ? 'text-[#b5a269]' : 'text-[#64748b]'}>
                {getCategoryIcon(cat.id)}
              </span>
              <span className="font-mono text-[10px] font-bold opacity-90">{cat.code}</span>
              <span className="max-w-[130px] sm:max-w-[200px] truncate text-left font-medium">{cat.name}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  isSelected ? 'bg-[#003622] text-[#b5a269]' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Category Detail Card if any */}
      {selectedCategoryObj && (
        <div className="mt-3 p-3 bg-slate-50 border-l-4 border-[#b5a269] border-y border-r border-[#cbd5e1] rounded-r-lg text-xs flex items-start gap-2.5">
          <div className="p-1.5 bg-[#0c2340] text-[#b5a269] rounded mt-0.5 shrink-0">
            {getCategoryIcon(selectedCategoryObj.id)}
          </div>
          <div>
            <div className="font-bold text-[#0c2340] flex items-center gap-2">
              <span>{selectedCategoryObj.code}: {selectedCategoryObj.name}</span>
            </div>
            <p className="text-[#64748b] text-[11px] mt-0.5 leading-relaxed">
              {selectedCategoryObj.shortDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
