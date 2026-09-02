import React, { useState } from 'react';
import { PressArticle, ImpactLevel, StrategicTendency } from '../types';
import { ArticleCard } from './ArticleCard';
import { CategoryFilter } from './CategoryFilter';
import {
  Search,
  CheckCheck,
  XSquare,
  FileText,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Filter,
  LayoutGrid,
  List,
  ShieldCheck
} from 'lucide-react';

interface PressFeedProps {
  articles: PressArticle[];
  selectedCategory: number | 'all';
  onSelectCategory: (id: number | 'all') => void;
  onToggleSelectArticle: (id: string) => void;
  onSelectAllArticles: () => void;
  onDeselectAllArticles: () => void;
  onNavigateToCable: () => void;
  onScanPress: () => void;
  isScanning: boolean;
}

export const PressFeed: React.FC<PressFeedProps> = ({
  articles,
  selectedCategory,
  onSelectCategory,
  onToggleSelectArticle,
  onSelectAllArticles,
  onDeselectAllArticles,
  onNavigateToCable,
  onScanPress,
  isScanning,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [impactFilter, setImpactFilter] = useState<'all' | ImpactLevel>('all');
  const [tendencyFilter, setTendencyFilter] = useState<'all' | StrategicTendency>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtered Articles
  const filteredArticles = React.useMemo(() => {
    return articles.filter((art) => {
      // Category filter
      if (selectedCategory !== 'all' && !art.categoryIds.includes(selectedCategory)) {
        return false;
      }
      // Impact filter
      if (impactFilter !== 'all' && art.impactLevel !== impactFilter) {
        return false;
      }
      // Tendency filter
      if (tendencyFilter !== 'all' && art.strategicTendency !== tendencyFilter) {
        return false;
      }
      // Location filter
      if (locationFilter !== 'all' && art.location !== locationFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(q);
        const matchesSummary = art.summary.toLowerCase().includes(q);
        const matchesImplication = art.bilateralImplication.toLowerCase().includes(q);
        const matchesSource = art.source.toLowerCase().includes(q);
        const matchesActors = art.keyActors?.some((act) => act.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesImplication && !matchesSource && !matchesActors) {
          return false;
        }
      }
      return true;
    });
  }, [articles, selectedCategory, impactFilter, tendencyFilter, locationFilter, searchQuery]);

  const selectedCount = articles.filter((a) => a.selectedForReport).length;
  const highImpactCount = articles.filter((a) => a.impactLevel === 'Alto').length;
  const opportunityCount = articles.filter((a) => a.strategicTendency.includes('Oportunidad')).length;
  const riskCount = articles.filter((a) => a.strategicTendency.includes('Riesgo')).length;

  return (
    <div className="space-y-6">
      {/* Top Bento Matrix Row with Quick Diplomatic Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Monitored News */}
        <div className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                Total Monitoreado
              </span>
              <span className="bg-[#0c2340] text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                DFW Metroplex
              </span>
            </div>
            <div className="text-3xl font-black text-[#0c2340] mt-2 font-mono">
              {articles.length}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#64748b]">
            <span>13 Ejes DGEDAN Activos</span>
            <span className="text-[#00472e] font-bold">100% Cobertura</span>
          </div>
        </div>

        {/* Tile 2: High Impact Priority */}
        <div className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#ef4444] uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
                Impacto Alto / Alertas
              </span>
              <span className="bg-rose-50 text-[#ef4444] text-[9px] px-1.5 py-0.5 rounded font-bold border border-rose-200">
                PRIORIDAD
              </span>
            </div>
            <div className="text-3xl font-black text-[#ef4444] mt-2 font-mono">
              {highImpactCount}
            </div>
          </div>
          <div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#ef4444] h-full rounded-full"
                style={{ width: `${articles.length > 0 ? (highImpactCount / articles.length) * 100 : 0}%` }}
              />
            </div>
            <div className="pt-2 mt-2 flex items-center justify-between text-[11px] text-[#64748b]">
              <span>{riskCount} con tendencia de riesgo</span>
              <span className="text-rose-600 font-bold">Atención SRE</span>
            </div>
          </div>
        </div>

        {/* Tile 3: Bilateral Opportunities */}
        <div className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#b5a269] uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#b5a269]" />
                Oportunidades Bilaterales
              </span>
              <span className="bg-[#b5a269]/10 text-[#0c2340] text-[9px] px-1.5 py-0.5 rounded font-bold border border-[#b5a269]/30">
                T-MEC & COMERCIO
              </span>
            </div>
            <div className="text-3xl font-black text-[#0c2340] mt-2 font-mono">
              {opportunityCount}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#64748b]">
            <span>Logística, vuelos, inversión</span>
            <span className="text-[#00472e] font-bold">Cooperación</span>
          </div>
        </div>

        {/* Tile 4: Despacho Status */}
        <div className="bg-[#0c2340] text-white border border-[#0c2340] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#b5a269] uppercase tracking-wider">
                Despacho DGEDAN
              </span>
              <span className="bg-[#b5a269] text-[#0c2340] text-[9px] px-1.5 py-0.5 rounded font-black">
                {selectedCount} NOTAS
              </span>
            </div>
            <div className="text-3xl font-black text-white mt-2 font-mono">
              {selectedCount} <span className="text-xs text-[#94a3b8] font-normal">/ {articles.length}</span>
            </div>
          </div>

          <button
            id="btn-quick-cable"
            onClick={onNavigateToCable}
            disabled={selectedCount === 0}
            className="mt-3 text-xs font-bold bg-[#00472e] hover:bg-[#003622] disabled:opacity-50 text-white py-2 px-3 rounded-lg flex items-center justify-between transition-colors shadow-xs"
          >
            <span>Generar Despacho</span>
            <FileText className="w-3.5 h-3.5 text-[#b5a269] ml-1" />
          </button>
        </div>
      </div>

      {/* 13 DGEDAN Thematic Categories Bento Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        articles={articles}
      />

      {/* Search & Secondary Filter Bar */}
      <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-press"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por actor (Abbott, Cruz), tema (T-MEC, DFW Airport, aranceles, migración, agua), medio..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] text-[#1e293b] placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Impact Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-[#64748b] font-bold shrink-0">Impacto:</span>
            <select
              id="select-impact-filter"
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value as any)}
              className="px-2.5 py-2 text-xs rounded-lg border border-[#cbd5e1] text-[#1e293b] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 w-full md:w-auto"
            >
              <option value="all">Todos los niveles</option>
              <option value="Alto">Alto Impacto</option>
              <option value="Medio">Medio Impacto</option>
              <option value="Bajo">Bajo Impacto</option>
            </select>
          </div>

          {/* Tendency Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-[#64748b] font-bold shrink-0">Tendencia:</span>
            <select
              id="select-tendency-filter"
              value={tendencyFilter}
              onChange={(e) => setTendencyFilter(e.target.value as any)}
              className="px-2.5 py-2 text-xs rounded-lg border border-[#cbd5e1] text-[#1e293b] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 w-full md:w-auto"
            >
              <option value="all">Todas las tendencias</option>
              <option value="Riesgo / Tensión">Riesgo / Tensión</option>
              <option value="Oportunidad / Cooperación">Oportunidad / Cooperación</option>
              <option value="Seguimiento / Neutro">Seguimiento / Neutro</option>
            </select>
          </div>

          {/* Layout View Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-[#cbd5e1] shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#0c2340] shadow-xs' : 'text-[#64748b] hover:text-[#0c2340]'
              }`}
              title="Vista Bento Grid (2 Columnas)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-[#0c2340] shadow-xs' : 'text-[#64748b] hover:text-[#0c2340]'
              }`}
              title="Vista Lista Expandida"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selection Batch Controls & Verified Protocol */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-[#64748b]">
          <div className="flex items-center gap-2">
            <span>Mostrando <strong className="text-[#0c2340]">{filteredArticles.length}</strong> de {articles.length} notas analizadas</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00472e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00472e]" />
              Fuentes y Enlaces Verificados
            </span>
            {(searchQuery || impactFilter !== 'all' || tendencyFilter !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setImpactFilter('all');
                  setTendencyFilter('all');
                  onSelectCategory('all');
                }}
                className="text-[#0c2340] hover:text-[#00472e] font-bold underline text-[11px]"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-select-all"
              onClick={onSelectAllArticles}
              className="inline-flex items-center gap-1 text-[#1e293b] hover:text-[#0c2340] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border border-[#cbd5e1]"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#00472e]" />
              <span>Seleccionar todas</span>
            </button>

            <button
              id="btn-deselect-all"
              onClick={onDeselectAllArticles}
              className="inline-flex items-center gap-1 text-[#1e293b] hover:text-[#0c2340] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border border-[#cbd5e1]"
            >
              <XSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Deseleccionar todas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Cards Grid - Bento Layout */}
      {filteredArticles.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isSelected={!!article.selectedForReport}
              onToggleSelect={onToggleSelectArticle}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#cbd5e1] rounded-xl p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-[#94a3b8] mx-auto flex items-center justify-center">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1e293b]">
            No se encontraron notas con los filtros seleccionados
          </h3>
          <p className="text-xs text-[#64748b] max-w-md mx-auto">
            Intenta restablecer los filtros de búsqueda o realiza un escaneo nuevo de la prensa de Norte de Texas.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setImpactFilter('all');
                setTendencyFilter('all');
                onSelectCategory('all');
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#1e293b] rounded-lg text-xs font-bold border border-[#cbd5e1]"
            >
              Restablecer Filtros
            </button>
            <button
              onClick={onScanPress}
              disabled={isScanning}
              className="px-3.5 py-1.5 bg-[#00472e] hover:bg-[#003622] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>Escanear Prensa Ahora</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
