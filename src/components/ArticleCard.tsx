import React, { useState } from 'react';
import { PressArticle, DGEDAN_CATEGORIES } from '../types';
import {
  ExternalLink,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Users,
  Shield,
  Lightbulb,
  CheckSquare,
  Square,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ArticleCardProps {
  article: PressArticle;
  onToggleSelect: (id: string) => void;
  isSelected: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onToggleSelect,
  isSelected,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryCategory = DGEDAN_CATEGORIES.find((c) => c.id === article.primaryCategoryId);

  const getImpactBadge = (level: string) => {
    switch (level) {
      case 'Alto':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-[#ef4444] border border-rose-200 uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3 text-[#ef4444]" />
            Impacto Alto
          </span>
        );
      case 'Medio':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
            Impacto Medio
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#64748b] border border-slate-200 uppercase tracking-wider">
            Impacto Bajo
          </span>
        );
    }
  };

  const getTendencyBadge = (tendency: string) => {
    if (tendency.includes('Riesgo')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          Riesgo
        </span>
      );
    }
    if (tendency.includes('Oportunidad')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#00472e] border border-emerald-200 uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3 text-[#00472e]" />
          Oportunidad
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#64748b] border border-slate-200 uppercase tracking-wider">
        <HelpCircle className="w-3 h-3 text-slate-500" />
        Seguimiento
      </span>
    );
  };

  return (
    <div
      className={`bg-white border rounded-xl transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden ${
        isSelected
          ? 'border-[#0c2340] ring-2 ring-[#0c2340]/20'
          : 'border-[#cbd5e1] hover:border-[#94a3b8]'
      }`}
    >
      {/* Top Header Card */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {primaryCategory && (
              <span className="inline-flex items-center gap-1 bg-[#0c2340] text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider shadow-xs">
                <span>{primaryCategory.code}</span>
                <span className="text-[#b5a269] font-normal opacity-90 hidden sm:inline">
                  · {primaryCategory.name}
                </span>
              </span>
            )}
            {getImpactBadge(article.impactLevel)}
            {getTendencyBadge(article.strategicTendency)}
          </div>

          {/* Checkbox toggle for report selection */}
          <button
            id={`btn-select-${article.id}`}
            onClick={() => onToggleSelect(article.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              isSelected
                ? 'bg-[#00472e] text-white shadow-xs'
                : 'bg-slate-100 text-[#475569] hover:bg-slate-200 border border-[#cbd5e1]'
            }`}
            title="Incluir o descartar esta nota para el Despacho Oficial a DGEDAN"
          >
            {isSelected ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-[#b5a269]" />
                <span>En Despacho</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 text-slate-400" />
                <span>Incluir</span>
              </>
            )}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#1e293b] leading-snug">
          {article.title}
        </h3>

        {/* Source metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#64748b] mt-2.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#0c2340]">{article.source}</span>
            {article.verified && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-[#00472e] border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#00472e]" />
                Verificada
              </span>
            )}
          </div>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#b5a269]" />
            {article.location}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {article.date}
          </span>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#00472e] hover:text-[#003622] font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 ml-auto transition-colors"
              title="Abrir enlace oficial vigente en pestaña nueva"
            >
              <span>Ver Fuente Oficial</span>
              <ExternalLink className="w-3 h-3 text-[#00472e]" />
            </a>
          )}
        </div>

        {/* Executive Summary */}
        <p className="text-sm text-[#475569] mt-3 leading-relaxed">
          {article.summary}
        </p>

        {/* Bilateral Impact Block (Bento styled with left gold border) */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border-l-2 border-[#b5a269] pl-3">
            <p className="text-[10px] text-[#94a3b8] uppercase font-bold mb-1">
              Implicación Bilateral para México
            </p>
            <p className="text-xs font-medium text-[#1e293b] leading-relaxed">
              {article.bilateralImplication}
            </p>
          </div>

          <div className="border-l-2 border-[#0c2340] pl-3">
            <p className="text-[10px] text-[#94a3b8] uppercase font-bold mb-1">
              Recomendación Operativa DGEDAN / SRE
            </p>
            <p className="text-xs font-medium text-[#475569] leading-relaxed">
              {article.suggestedAction}
            </p>
          </div>
        </div>

        {/* Collapsible deeper intelligence details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[#cbd5e1] space-y-3 animate-in fade-in duration-200">
            {/* Key Actors */}
            {article.keyActors && article.keyActors.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b] mb-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0c2340]" />
                  <span>Actores Clave Involucrados:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {article.keyActors.map((actor, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs bg-slate-100 text-[#0c2340] border border-[#cbd5e1] font-semibold"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary category tags if multiple */}
            {article.categoryIds.length > 1 && (
              <div className="text-[11px] text-[#64748b]">
                <span className="font-bold text-[#0c2340]">Ejes secundarios vinculados: </span>
                {article.categoryIds
                  .filter((id) => id !== article.primaryCategoryId)
                  .map((id) => {
                    const c = DGEDAN_CATEGORIES.find((cat) => cat.id === id);
                    return c ? `${c.code} (${c.name})` : `EJE-${id}`;
                  })
                  .join('; ')}
              </div>
            )}
          </div>
        )}

        {/* Toggle Details Button */}
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#64748b]">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 font-bold text-[#0c2340] hover:text-[#00472e] transition-colors"
          >
            <span>{isExpanded ? 'Ocultar detalles extendidos' : 'Ver actores y ejes adicionales'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#b5a269]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#b5a269]" />}
          </button>

          <span className="text-[10px] text-[#94a3b8] font-mono font-bold uppercase tracking-wider">
            ID: {article.id}
          </span>
        </div>
      </div>
    </div>
  );
};
