import React, { useState, useEffect } from 'react';
import { PressArticle, DiplomaticCable, DGEDAN_CATEGORIES } from '../types';
import {
  FileText,
  Mail,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  Save,
  Send,
  Building2,
  Shield,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CableGeneratorProps {
  selectedArticles: PressArticle[];
  onSaveCableToArchive: (cable: DiplomaticCable) => void;
  onNavigateToFeed: () => void;
}

export const CableGenerator: React.FC<CableGeneratorProps> = ({
  selectedArticles,
  onSaveCableToArchive,
  onNavigateToFeed,
}) => {
  const todayStr = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Cable State
  const [subject, setSubject] = useState(
    `[DGEDAN-NTX] Reporte de Coyuntura y Seguimiento Estratégico - ${todayStr}`
  );
  const [executiveSummary, setExecutiveSummary] = useState(
    'Durante la jornada en la circunscripción de Norte de Texas (Dallas-Fort Worth Metroplex y condados aledaños), se identificaron acontecimientos prioritarios vinculados con el intercambio comercial bilateral, pronunciamientos de actores políticos locales sobre la agenda transfronteriza y nuevas iniciativas de conectividad logística e institucional.'
  );
  const [strategicRiskAssessment, setStrategicRiskAssessment] = useState(
    'Monitoreo prioritario a iniciativas regulatorias y discursos de seguridad interestatal que puedan incidir en transportistas comerciales y en el flujo ágil del corredor logístico I-35 / DFW, así como atención preventiva a las comunidades mexicanas en la región.'
  );
  const [bilateralOpportunities, setBilateralOpportunities] = useState(
    'Oportunidades destacadas para afianzar la narrativa del T-MEC respaldada por las cifras de intercambio de manufactura y electrónica reportadas por la Reserva Federal de Dallas, además del impulso a nuevas frecuencias aéreas del Aeropuerto Internacional DFW con centros industriales en México.'
  );
  const [recommendedActions, setRecommendedActions] = useState(
    '1. Transmitir el reporte a las áreas operativas de la DGEDAN y de la Subsecretaría para América del Norte (SSAN).\n2. Dar seguimiento a las invitaciones de foros académicos (SMU Tower Center) y gestionar reuniones de vinculación con autoridades de transporte y comercio del Norte de Texas.'
  );
  const [consularNotes, setConsularNotes] = useState('');

  // Auto-synthesize with Gemini when entering with selected articles if empty
  const handleAIGenerateSynthesis = async () => {
    if (selectedArticles.length === 0) return;
    setIsSynthesizing(true);
    try {
      const response = await fetch('/api/synthesize-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articles: selectedArticles,
          consularNotes,
          dateStr: todayStr,
        }),
      });
      const data = await response.json();
      if (data.success && data.cable) {
        setSubject(data.cable.subject);
        setExecutiveSummary(data.cable.executiveSummary);
        setStrategicRiskAssessment(data.cable.strategicRiskAssessment);
        setBilateralOpportunities(data.cable.bilateralOpportunities);
        setRecommendedActions(data.cable.recommendedRepresentationActions);
      }
    } catch (err) {
      console.error('Error synthesizing cable:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Group articles by primary category
  const groupedArticles = React.useMemo(() => {
    const map = new Map<number, PressArticle[]>();
    selectedArticles.forEach((art) => {
      const catId = art.primaryCategoryId;
      if (!map.has(catId)) map.set(catId, []);
      map.get(catId)!.push(art);
    });
    return map;
  }, [selectedArticles]);

  // Generate plain text version for copying / email
  const buildPlainTextCable = () => {
    let text = `================================================================================
GOBIERNO DE MÉXICO • SECRETARÍA DE RELACIONES EXTERIORES (SRE)
SUBSECRETARÍA PARA AMÉRICA DEL NORTE (SSAN)
DIRECCIÓN GENERAL DE ESTRATEGIA DIPLOMÁTICA PARA AMÉRICA DEL NORTE (DGEDAN)
REPRESENTACIÓN EN NORTE DE TEXAS (DALLAS-FORT WORTH METROPLEX)
================================================================================

PARA: Dirección General de Estrategia Diplomática para América del Norte <dgedanorte@sre.gob.mx>
CON COPIA (CC): Subsecretaría para América del Norte <ssan@sre.gob.mx>
FECHA: ${todayStr}
ASUNTO: ${subject}
CIRCUNSCRIPCIÓN: Norte de Texas (Condados de Dallas, Tarrant, Collin, Denton, etc.)

--------------------------------------------------------------------------------
1. SÍNTESIS EJECUTIVA DE LA JORNADA
--------------------------------------------------------------------------------
${executiveSummary}

--------------------------------------------------------------------------------
2. NOTAS Y ACONTECIMIENTOS PRIORITARIOS POR EJE TEMÁTICO (${selectedArticles.length} NOTAS)
--------------------------------------------------------------------------------
`;

    Array.from(groupedArticles.entries()).forEach(([catId, arts]) => {
      const cat = DGEDAN_CATEGORIES.find((c) => c.id === catId);
      text += `\n[${cat?.code || 'EJE'}] ${cat?.name.toUpperCase() || 'EJE TEMÁTICO'}\n`;
      text += `------------------------------------------------------------\n`;
      arts.forEach((art, index) => {
        text += `${index + 1}. ${art.title}\n`;
        text += `   • Fuente: ${art.source} [Fuente Verificada]\n`;
        if (art.sourceUrl) {
          text += `   • Enlace Oficial Vigente: ${art.sourceUrl}\n`;
        }
        text += `   • Ubicación: ${art.location} | Fecha: ${art.date}\n`;
        text += `   • Impacto: ${art.impactLevel} | Tendencia: ${art.strategicTendency}\n`;
        text += `   • Resumen: ${art.summary}\n`;
        if (art.keyActors && art.keyActors.length > 0) {
          text += `   • Actores clave: ${art.keyActors.join(', ')}\n`;
        }
        text += `   • Implicación para México: ${art.bilateralImplication}\n`;
        text += `   • Recomendación operativa: ${art.suggestedAction}\n\n`;
      });
    });

    text += `--------------------------------------------------------------------------------
3. EVALUACIÓN DE RIESGOS ESTRATÉGICOS
--------------------------------------------------------------------------------
${strategicRiskAssessment}

--------------------------------------------------------------------------------
4. OPORTUNIDADES BILATERALES Y AGENDA DE COOPERACIÓN
--------------------------------------------------------------------------------
${bilateralOpportunities}

--------------------------------------------------------------------------------
5. RECOMENDACIONES DE ACCIÓN Y SEGUIMIENTO PARA LA DGEDAN Y SRE
--------------------------------------------------------------------------------
${recommendedActions}

================================================================================
FIN DEL DESPACHO INFORMATIVO OFICIAL • SRE / DGEDAN NORTE DE TEXAS
================================================================================`;

    return text;
  };

  const handleCopyText = () => {
    const text = buildPlainTextCable();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenMailClient = () => {
    const emailTo = 'dgedanorte@sre.gob.mx';
    const emailCc = 'ssan@sre.gob.mx';
    const bodyContent = buildPlainTextCable();
    const mailtoUrl = `mailto:${emailTo}?cc=${emailCc}&subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyContent)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleDownloadTxt = () => {
    const text = buildPlainTextCable();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Despacho_DGEDAN_Norte_Texas_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToArchive = () => {
    const cable: DiplomaticCable = {
      id: `cable-${Date.now()}`,
      code: `DGEDAN-NTX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`,
      date: todayStr,
      jurisdiction: 'Circunscripción Norte de Texas (DFW)',
      recipientPrimary: 'dgedanorte@sre.gob.mx',
      recipientCC: 'ssan@sre.gob.mx',
      subject,
      executiveSummary,
      articles: selectedArticles,
      strategicRiskAssessment,
      bilateralOpportunities,
      recommendedRepresentationActions: recommendedActions,
      author: 'Representación Consular / Unidad de Estrategia Diplomática Norte de Texas',
      createdAt: new Date().toISOString(),
    };
    onSaveCableToArchive(cable);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (selectedArticles.length === 0) {
    return (
      <div className="bg-white border border-[#cbd5e1] rounded-xl p-10 text-center max-w-2xl mx-auto shadow-xs">
        <div className="w-14 h-14 bg-[#b5a269]/20 text-[#0c2340] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#b5a269]/40">
          <AlertCircle className="w-7 h-7 text-[#0c2340]" />
        </div>
        <h3 className="text-lg font-bold text-[#0c2340]">
          No hay notas seleccionadas para el Despacho Oficial
        </h3>
        <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
          Selecciona las notas y acontecimientos en el <strong>Monitor de Prensa</strong> marcando la casilla &quot;Incluir en Despacho&quot; para estructurar el reporte diplomático del día para DGEDAN y SSAN.
        </p>
        <button
          id="btn-return-feed"
          onClick={onNavigateToFeed}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[#00472e] hover:bg-[#003622] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <span>Ir al Monitor de Prensa</span>
          <ChevronRight className="w-4 h-4 text-[#b5a269]" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00472e]"></span>
            <h2 className="text-base font-bold text-[#0c2340]">
              Despacho Diplomático Listo para Transmisión
            </h2>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Incluye <strong className="text-[#0c2340]">{selectedArticles.length} notas analizadas</strong> de la circunscripción Norte de Texas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-ai-synthesize"
            onClick={handleAIGenerateSynthesis}
            disabled={isSynthesizing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0c2340]/5 hover:bg-[#0c2340]/10 text-[#0c2340] border border-[#cbd5e1] rounded-lg text-xs font-bold transition-colors"
            title="Recalcular síntesis ejecutiva con IA"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin text-[#b5a269]' : 'text-[#b5a269]'}`} />
            <span>{isSynthesizing ? 'Sintetizando...' : 'Auto-Sintetizar con IA'}</span>
          </button>

          <button
            id="btn-copy-cable"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#1e293b] border border-[#cbd5e1] rounded-lg text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00472e]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            id="btn-send-email-dgedan"
            onClick={handleOpenMailClient}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00472e] hover:bg-[#003622] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            title="Abrir en cliente de correo con destinatarios dgedanorte@sre.gob.mx y cc: ssan@sre.gob.mx"
          >
            <Send className="w-3.5 h-3.5 text-[#b5a269]" />
            <span>Enviar a dgedanorte@sre.gob.mx</span>
          </button>

          <button
            id="btn-save-archive"
            onClick={handleSaveToArchive}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0c2340] hover:bg-[#08182c] text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-[#b5a269]" />
            <span>{savedSuccess ? '¡Guardado!' : 'Archivar'}</span>
          </button>

          <button
            id="btn-print-cable"
            onClick={handlePrint}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-[#cbd5e1] rounded-lg text-xs transition-colors"
            title="Imprimir / Guardar PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            id="btn-download-txt"
            onClick={handleDownloadTxt}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-[#cbd5e1] rounded-lg text-xs transition-colors"
            title="Descargar archivo .txt"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official SRE Cable Letterhead & Body */}
      <div className="bg-white border border-[#cbd5e1] rounded-xl shadow-sm p-6 sm:p-10 font-sans print:shadow-none print:border-none">
        {/* Letterhead Header */}
        <div className="border-b-2 border-[#0c2340] pb-5 text-center space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest font-black text-[#64748b]">
            Gobierno de México • Secretaría de Relaciones Exteriores
          </div>
          <div className="text-base sm:text-lg font-black uppercase tracking-tight text-[#0c2340]">
            Subsecretaría para América del Norte (SSAN)
          </div>
          <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#00472e]">
            Dirección General de Estrategia Diplomática para América del Norte (DGEDAN)
          </div>
          <div className="text-[11px] font-semibold text-[#64748b] pt-1">
            Representación Consular y Seguimiento Estratégico · Norte de Texas (DFW Metroplex)
          </div>
        </div>

        {/* Metadata Dispatch Grid */}
        <div className="bg-[#f0f2f5] border border-[#cbd5e1] rounded-xl p-4 my-5 text-xs grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#0c2340] w-24">DESTINATARIO:</span>
              <span className="font-mono text-[#00472e] font-bold bg-white px-2 py-0.5 rounded border border-[#cbd5e1]">
                dgedanorte@sre.gob.mx
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#0c2340] w-24">CON COPIA (CC):</span>
              <span className="font-mono text-[#1e293b] bg-white px-2 py-0.5 rounded border border-[#cbd5e1]">
                ssan@sre.gob.mx
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#0c2340] w-24">CIRCUNSCRIPCIÓN:</span>
              <span className="text-[#475569] font-medium">Norte de Texas (Dallas, Fort Worth, Collin, Denton, Tarrant)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#0c2340] w-24">FECHA:</span>
              <span className="text-[#1e293b] font-medium">{todayStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#0c2340] w-24">CÓDIGO REF:</span>
              <span className="font-mono text-[#0c2340] font-bold bg-[#b5a269]/20 border border-[#b5a269]/40 px-2 py-0.5 rounded">
                DGEDAN-NTX-{new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#0c2340] w-24">NOTAS:</span>
              <span className="font-bold text-[#00472e]">{selectedArticles.length} seleccionadas</span>
            </div>
          </div>

          {/* Editable Subject Line */}
          <div className="md:col-span-2 pt-2 border-t border-[#cbd5e1] flex items-center gap-2">
            <span className="font-bold text-[#0c2340] w-24 shrink-0">ASUNTO:</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs font-bold text-[#1e293b] bg-white border border-[#cbd5e1] rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0c2340]"
            />
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2 my-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0c2340] flex items-center gap-2 border-b-2 border-[#0c2340] pb-1">
              <span>1. SÍNTESIS EJECUTIVA DE LA JORNADA</span>
            </h3>
            <span className="text-[10px] text-[#94a3b8] uppercase font-bold">Editable</span>
          </div>
          <textarea
            value={executiveSummary}
            onChange={(e) => setExecutiveSummary(e.target.value)}
            rows={4}
            className="w-full text-xs leading-relaxed text-[#1e293b] bg-white border border-[#cbd5e1] rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20"
          />
        </div>

        {/* Section 2: Selected Articles classified by the 13 DGEDAN Axes */}
        <div className="space-y-4 my-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#0c2340] border-b-2 border-[#0c2340] pb-1">
            2. ACONTECIMIENTOS Y NOTAS PRIORITARIAS CLASIFICADAS POR EJE ({selectedArticles.length})
          </h3>

          <div className="space-y-4">
            {Array.from(groupedArticles.entries()).map(([catId, arts]) => {
              const category = DGEDAN_CATEGORIES.find((c) => c.id === catId);
              return (
                <div key={catId} className="border border-[#cbd5e1] rounded-xl p-4 bg-[#f0f2f5]/60">
                  <div className="flex items-center justify-between border-b border-[#cbd5e1] pb-2 mb-3">
                    <span className="text-xs font-bold text-[#0c2340] font-mono flex items-center gap-2">
                      <span className="bg-[#0c2340] text-white px-2 py-0.5 rounded text-[10px] uppercase">
                        {category?.code}
                      </span>
                      <span>{category?.name}</span>
                    </span>
                    <span className="text-[11px] text-[#64748b] font-medium">
                      {arts.length} {arts.length === 1 ? 'acontecimiento' : 'acontecimientos'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {arts.map((art, idx) => (
                      <div key={art.id} className="bg-white border border-[#cbd5e1] rounded-lg p-4 space-y-2 shadow-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-xs text-[#1e293b] leading-snug">
                            {idx + 1}. {art.title}
                          </div>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                              art.impactLevel === 'Alto'
                                ? 'bg-rose-50 text-[#ef4444] border border-rose-200'
                                : art.impactLevel === 'Medio'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-[#64748b] border border-slate-200'
                            }`}
                          >
                            Impacto {art.impactLevel}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#64748b] flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1 font-semibold text-[#0c2340]">
                            <strong>Fuente:</strong> {art.source}
                          </span>
                          <span>·</span>
                          <span><strong>Ubicación:</strong> {art.location}</span>
                          <span>·</span>
                          <span><strong>Tendencia:</strong> {art.strategicTendency}</span>
                          {art.sourceUrl && (
                            <a
                              href={art.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#00472e] hover:underline font-bold ml-auto"
                              title="Abrir enlace oficial vigente"
                            >
                              <span>Fuente Verificada</span>
                              <ExternalLink className="w-3 h-3 text-[#00472e]" />
                            </a>
                          )}
                        </div>

                        <p className="text-xs text-[#475569] leading-relaxed">
                          {art.summary}
                        </p>

                        <div className="text-xs bg-slate-50 border-l-2 border-[#b5a269] rounded-r p-2 text-[#1e293b]">
                          <div className="font-bold text-[10px] uppercase text-[#94a3b8]">Implicación para México:</div>
                          <div className="text-[#1e293b] mt-0.5">{art.bilateralImplication}</div>
                        </div>

                        <div className="text-xs bg-slate-50 border-l-2 border-[#00472e] rounded-r p-2 text-[#1e293b]">
                          <div className="font-bold text-[10px] uppercase text-[#00472e]">Recomendación de Acción:</div>
                          <div className="text-[#1e293b] mt-0.5">{art.suggestedAction}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Strategic Risk Assessment */}
        <div className="space-y-2 my-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0c2340] flex items-center gap-2 border-b-2 border-[#0c2340] pb-1">
              <span>3. EVALUACIÓN DE RIESGOS ESTRATÉGICOS</span>
            </h3>
            <span className="text-[10px] text-[#94a3b8] uppercase font-bold">Editable</span>
          </div>
          <textarea
            value={strategicRiskAssessment}
            onChange={(e) => setStrategicRiskAssessment(e.target.value)}
            rows={3}
            className="w-full text-xs leading-relaxed text-[#1e293b] bg-white border border-[#cbd5e1] rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20"
          />
        </div>

        {/* Section 4: Bilateral Opportunities */}
        <div className="space-y-2 my-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0c2340] flex items-center gap-2 border-b-2 border-[#0c2340] pb-1">
              <span>4. OPORTUNIDADES BILATERALES Y AGENDA DE COOPERACIÓN</span>
            </h3>
            <span className="text-[10px] text-[#94a3b8] uppercase font-bold">Editable</span>
          </div>
          <textarea
            value={bilateralOpportunities}
            onChange={(e) => setBilateralOpportunities(e.target.value)}
            rows={3}
            className="w-full text-xs leading-relaxed text-[#1e293b] bg-white border border-[#cbd5e1] rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20"
          />
        </div>

        {/* Section 5: Recommended Actions */}
        <div className="space-y-2 my-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0c2340] flex items-center gap-2 border-b-2 border-[#0c2340] pb-1">
              <span>5. RECOMENDACIONES DE ACCIÓN Y SEGUIMIENTO PARA LA DGEDAN Y SRE</span>
            </h3>
            <span className="text-[10px] text-[#94a3b8] uppercase font-bold">Editable</span>
          </div>
          <textarea
            value={recommendedActions}
            onChange={(e) => setRecommendedActions(e.target.value)}
            rows={4}
            className="w-full text-xs leading-relaxed text-[#1e293b] bg-white border border-[#cbd5e1] rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 font-mono"
          />
        </div>

        {/* Signoff footer */}
        <div className="border-t-2 border-[#0c2340] pt-4 mt-8 text-center text-xs text-[#64748b] space-y-1">
          <div className="font-bold text-[#0c2340]">
            Unidad de Análisis Estratégico y Seguimiento Diplomático • Norte de Texas
          </div>
          <div className="text-[11px] text-[#94a3b8]">
            Remitido electrónicamente a Dirección General de Estrategia Diplomática para América del Norte (dgedanorte@sre.gob.mx) con copia a la Subsecretaría para América del Norte (ssan@sre.gob.mx)
          </div>
        </div>
      </div>
    </div>
  );
};
