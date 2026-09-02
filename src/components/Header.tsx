import React from 'react';
import { Building2, ShieldCheck, RefreshCw, PlusCircle, FileText, Globe, Layers, BookOpen, Mail } from 'lucide-react';

interface HeaderProps {
  activeTab: 'feed' | 'cable' | 'ingest' | 'sources' | 'archive';
  setActiveTab: (tab: 'feed' | 'cable' | 'ingest' | 'sources' | 'archive') => void;
  onScanPress: () => void;
  isScanning: boolean;
  selectedArticlesCount: number;
  totalArticlesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onScanPress,
  isScanning,
  selectedArticlesCount,
  totalArticlesCount,
}) => {
  const currentDateFormatted = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <header className="bg-[#0c2340] border-b-2 border-[#b5a269] text-white sticky top-0 z-30 shadow-md">
      {/* Top Protocol Bar */}
      <div className="bg-[#08182c] px-4 py-1.5 text-xs text-[#94a3b8] border-b border-[#1e3a5f] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#b5a269] animate-pulse"></span>
          <span className="font-semibold text-slate-200">SRE • Subsecretaría para América del Norte (SSAN)</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium">Dirección General de Estrategia Diplomática para América del Norte (DGEDAN)</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1.5 text-[#b5a269] font-mono text-[11px] bg-[#0c2340] px-2 py-0.5 rounded border border-[#b5a269]/40">
            <Mail className="w-3 h-3 text-[#b5a269]" />
            <span>Destino: dgedanorte@sre.gob.mx</span>
            <span className="text-slate-400">• CC: ssan@sre.gob.mx</span>
          </div>
          <span className="hidden md:inline text-[#94a3b8] font-mono">Circunscripción: Norte de Texas</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Official SRE Box Badge from Bento Design */}
          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center p-1 shadow-xs shrink-0">
            <div className="w-full h-full border-2 border-[#00472e] flex items-center justify-center font-black text-[#00472e] text-xs tracking-tighter">
              SRE
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                MONITOR ESTRATÉGICO <span className="text-[#b5a269] font-normal">· NORTE DE TEXAS</span>
              </h1>
              <span className="bg-[#b5a269] text-[#0c2340] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-black shadow-xs">
                DGEDAN
              </span>
            </div>
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest mt-0.5">
              Dirección General de Estrategia Diplomática para América del Norte · DFW Metroplex
            </p>
          </div>
        </div>

        {/* Status indicator and action buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="hidden lg:flex items-center gap-3 pr-2 border-r border-[#1e3a5f]">
            <div className="text-right">
              <p className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-wider">ÚLTIMA REVISIÓN</p>
              <p className="text-xs font-mono text-white">{currentDateFormatted} · ACTIVA</p>
            </div>
          </div>

          <button
            id="btn-scan-press"
            onClick={onScanPress}
            disabled={isScanning}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-all ${
              isScanning
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-[#00472e] hover:bg-[#003622] text-white border border-[#00472e] hover:shadow active:scale-[0.98]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#b5a269]' : ''}`} />
            <span>{isScanning ? 'Escaneando Prensa DFW...' : 'Escanear Prensa Diaria'}</span>
          </button>

          <button
            id="btn-nav-cable"
            onClick={() => setActiveTab('cable')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cable'
                ? 'bg-[#b5a269] text-[#0c2340] ring-2 ring-[#b5a269]/40'
                : 'bg-[#153258] hover:bg-[#1c406f] text-white border border-[#2b5185]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#b5a269]" />
            <span>Despacho Oficial</span>
            {selectedArticlesCount > 0 && (
              <span className="bg-[#0c2340] text-[#b5a269] text-[11px] font-mono px-1.5 py-0.2 rounded font-bold border border-[#b5a269]/60">
                {selectedArticlesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1a3860]">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 scrollbar-none text-xs font-medium">
          <button
            id="tab-feed"
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'feed'
                ? 'bg-white text-[#0c2340] font-bold shadow-xs border border-white'
                : 'text-slate-300 hover:text-white hover:bg-[#153258]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#b5a269]" />
            <span>Monitor de Prensa & Ejes ({totalArticlesCount})</span>
          </button>

          <button
            id="tab-cable-nav"
            onClick={() => setActiveTab('cable')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'cable'
                ? 'bg-[#b5a269] text-[#0c2340] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#153258]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Redactar Despacho a DGEDAN</span>
            {selectedArticlesCount > 0 && (
              <span className="bg-[#0c2340] text-[#b5a269] text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                {selectedArticlesCount} notas
              </span>
            )}
          </button>

          <button
            id="tab-ingest"
            onClick={() => setActiveTab('ingest')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'ingest'
                ? 'bg-white text-[#0c2340] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#153258]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#b5a269]" />
            <span>Ingreso & Análisis de Nota / Evento</span>
          </button>

          <button
            id="tab-sources"
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'sources'
                ? 'bg-white text-[#0c2340] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#153258]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#b5a269]" />
            <span>Fuentes de Norte de Texas</span>
          </button>

          <button
            id="tab-archive"
            onClick={() => setActiveTab('archive')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'archive'
                ? 'bg-white text-[#0c2340] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#153258]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#b5a269]" />
            <span>Archivo de Despachos</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
