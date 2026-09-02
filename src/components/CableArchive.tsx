import React, { useState } from 'react';
import { DiplomaticCable, DGEDAN_CATEGORIES } from '../types';
import {
  BookOpen,
  Calendar,
  Search,
  FileText,
  Mail,
  Copy,
  Check,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  Shield,
  Clock,
  Trash2
} from 'lucide-react';

interface CableArchiveProps {
  cables: DiplomaticCable[];
  onDeleteCable: (id: string) => void;
}

export const CableArchive: React.FC<CableArchiveProps> = ({ cables, onDeleteCable }) => {
  const [selectedCable, setSelectedCable] = useState<DiplomaticCable | null>(
    cables.length > 0 ? cables[0] : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredCables = React.useMemo(() => {
    if (!searchQuery.trim()) return cables;
    const q = searchQuery.toLowerCase();
    return cables.filter(
      (c) =>
        c.subject.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.executiveSummary.toLowerCase().includes(q) ||
        c.date.toLowerCase().includes(q)
    );
  }, [cables, searchQuery]);

  const handleCopySelected = () => {
    if (!selectedCable) return;
    const text = `GOBIERNO DE MÉXICO • SRE • SUBSECRETARÍA PARA AMÉRICA DEL NORTE (SSAN)
DIRECCIÓN GENERAL DE ESTRATEGIA DIPLOMÁTICA PARA AMÉRICA DEL NORTE (DGEDAN)
CÓDIGO: ${selectedCable.code} | FECHA: ${selectedCable.date}
DESTINATARIO: ${selectedCable.recipientPrimary} (CC: ${selectedCable.recipientCC})
ASUNTO: ${selectedCable.subject}

SÍNTESIS EJECUTIVA:
${selectedCable.executiveSummary}

EVALUACIÓN DE RIESGOS:
${selectedCable.strategicRiskAssessment}

OPORTUNIDADES:
${selectedCable.bilateralOpportunities}

RECOMENDACIONES:
${selectedCable.recommendedRepresentationActions}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = (cable: DiplomaticCable) => {
    const text = `GOBIERNO DE MÉXICO • SRE • DGEDAN\nDespacho: ${cable.code}\nFecha: ${cable.date}\nAsunto: ${cable.subject}\n\n${cable.executiveSummary}\n\n${cable.strategicRiskAssessment}\n\n${cable.bilateralOpportunities}\n\n${cable.recommendedRepresentationActions}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cable.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0c2340] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#00472e]" />
              <span>Archivo Histórico de Despachos y Cables Emitidos</span>
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Registro local de reportes remitidos a la Dirección General de Estrategia Diplomática para América del Norte (dgedanorte@sre.gob.mx) y a la Subsecretaría para América del Norte (ssan@sre.gob.mx).
            </p>
          </div>
          <div className="text-xs font-mono bg-[#f0f2f5] text-[#0c2340] px-3 py-1.5 rounded-lg border border-[#cbd5e1] font-bold">
            Total en archivo: <strong className="text-[#00472e]">{cables.length} despachos</strong>
          </div>
        </div>
      </div>

      {cables.length === 0 ? (
        <div className="bg-white border border-[#cbd5e1] rounded-xl p-10 text-center text-[#64748b] space-y-2 shadow-xs">
          <BookOpen className="w-10 h-10 text-[#cbd5e1] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#0c2340]">No hay despachos archivados aún</h3>
          <p className="text-xs text-[#64748b] max-w-md mx-auto">
            Cuando generes un despacho en la pestaña <strong>&quot;Redactar Despacho&quot;</strong>, pulsa el botón <strong>&quot;Archivar&quot;</strong> para guardar una copia histórica permanente en este registro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Cable List */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en el archivo histórico..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredCables.map((cable) => {
                const isSelected = selectedCable?.id === cable.id;
                return (
                  <div
                    key={cable.id}
                    onClick={() => setSelectedCable(cable)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#f0f2f5] border-l-4 border-l-[#0c2340] border-y border-r border-[#cbd5e1] shadow-xs'
                        : 'bg-white border-[#cbd5e1] hover:border-[#94a3b8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-bold text-[#0c2340] text-[11px] bg-[#b5a269]/20 border border-[#b5a269]/40 px-1.5 py-0.2 rounded">
                        {cable.code}
                      </span>
                      <span className="text-[10px] text-[#94a3b8] font-medium font-mono">
                        {cable.date}
                      </span>
                    </div>

                    <div className="font-bold text-[#1e293b] line-clamp-2 leading-snug">
                      {cable.subject}
                    </div>

                    <div className="text-[#64748b] text-[11px] mt-1.5 flex items-center justify-between">
                      <span>{cable.articles.length} notas analizadas</span>
                      <span className="text-[#00472e] font-bold flex items-center gap-0.5">
                        <span>Ver</span>
                        <ChevronRight className="w-3 h-3 text-[#b5a269]" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Cable View */}
          <div className="lg:col-span-2">
            {selectedCable ? (
              <div className="bg-white border border-[#cbd5e1] rounded-xl p-6 shadow-xs space-y-4">
                {/* Header Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#cbd5e1]">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#0c2340] bg-[#b5a269]/20 border border-[#b5a269]/40 px-2 py-0.5 rounded">
                      {selectedCable.code}
                    </span>
                    <span className="text-xs text-[#64748b] ml-2 font-medium">
                      Emitido el {selectedCable.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySelected}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#1e293b] border border-[#cbd5e1] rounded text-xs font-semibold"
                    >
                      {copied ? <Check className="w-3 h-3 text-[#00472e]" /> : <Copy className="w-3 h-3 text-slate-500" />}
                      <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadTxt(selectedCable)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#1e293b] border border-[#cbd5e1] rounded text-xs font-semibold"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      <span>Descargar</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar este despacho del historial?')) {
                          onDeleteCable(selectedCable.id);
                          setSelectedCable(cables.find(c => c.id !== selectedCable.id) || null);
                        }
                      }}
                      className="p-1 text-[#94a3b8] hover:text-[#ef4444] rounded transition-colors"
                      title="Eliminar de historial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dispatch Details */}
                <div className="space-y-3 text-xs">
                  <div className="bg-[#f0f2f5] p-3 rounded-lg border border-[#cbd5e1] space-y-1">
                    <div className="font-bold text-[#0c2340]">{selectedCable.subject}</div>
                    <div className="text-[#475569]">
                      <strong>Para:</strong> {selectedCable.recipientPrimary} | <strong>CC:</strong> {selectedCable.recipientCC}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-[#0c2340] text-[10px] mb-1">
                      1. Síntesis Ejecutiva
                    </h4>
                    <p className="text-[#1e293b] leading-relaxed bg-white border border-[#cbd5e1] rounded p-2.5">
                      {selectedCable.executiveSummary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-[#0c2340] text-[10px] mb-1">
                      2. Notas y Acontecimientos ({selectedCable.articles.length})
                    </h4>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {selectedCable.articles.map((art, idx) => (
                        <div key={idx} className="p-2.5 bg-[#f0f2f5] border border-[#cbd5e1] rounded-lg">
                          <div className="font-bold text-[#0c2340]">{idx + 1}. {art.title}</div>
                          <div className="text-[11px] text-[#64748b] mt-0.5">
                            Fuente: {art.source} | Ubicación: {art.location}
                          </div>
                          <p className="text-[11px] text-[#475569] mt-1">{art.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-[#0c2340] text-[10px] mb-1">
                      3. Evaluación de Riesgos
                    </h4>
                    <p className="text-[#1e293b] leading-relaxed bg-white border border-[#cbd5e1] rounded p-2.5">
                      {selectedCable.strategicRiskAssessment}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-[#0c2340] text-[10px] mb-1">
                      4. Oportunidades Bilaterales
                    </h4>
                    <p className="text-[#1e293b] leading-relaxed bg-white border border-[#cbd5e1] rounded p-2.5">
                      {selectedCable.bilateralOpportunities}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-[#0c2340] text-[10px] mb-1">
                      5. Recomendaciones de Acción
                    </h4>
                    <p className="text-[#1e293b] leading-relaxed bg-white border border-[#cbd5e1] rounded p-2.5 font-mono text-[11px]">
                      {selectedCable.recommendedRepresentationActions}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#cbd5e1] rounded-xl p-10 text-center text-[#94a3b8] shadow-xs">
                Selecciona un despacho de la lista para visualizar su contenido completo.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
