import React, { useState } from 'react';
import { PressArticle, DGEDAN_CATEGORIES, ImpactLevel, StrategicTendency } from '../types';
import {
  PlusCircle,
  Sparkles,
  RefreshCw,
  CheckCircle,
  FileText,
  Building2,
  Calendar,
  MapPin,
  Users,
  Shield,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

interface ManualIngestModalProps {
  onAddArticle: (article: PressArticle) => void;
  onClose?: () => void;
}

export const ManualIngestModal: React.FC<ManualIngestModalProps> = ({
  onAddArticle,
  onClose,
}) => {
  const [ingestMode, setIngestMode] = useState<'ai-parse' | 'manual-form'>('ai-parse');
  const [rawText, setRawText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedArticle, setAnalyzedArticle] = useState<PressArticle | null>(null);

  // Manual Form States
  const [formTitle, setFormTitle] = useState('');
  const [formSource, setFormSource] = useState('Reporte Directo de la Misión');
  const [formLocation, setFormLocation] = useState('Dallas-Fort Worth, TX');
  const [formCategoryId, setFormCategoryId] = useState<number>(3);
  const [formSummary, setFormSummary] = useState('');
  const [formActors, setFormActors] = useState('');
  const [formBilateralImplication, setFormBilateralImplication] = useState('');
  const [formImpactLevel, setFormImpactLevel] = useState<ImpactLevel>('Medio');
  const [formStrategicTendency, setFormStrategicTendency] = useState<StrategicTendency>('Seguimiento / Neutro');
  const [formSuggestedAction, setFormSuggestedAction] = useState('');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Quick Templates for Diplomatic Scenarios
  const handleApplyTemplate = (type: 'invitation' | 'visit' | 'airline' | 'meeting') => {
    setIngestMode('manual-form');
    if (type === 'invitation') {
      setFormCategoryId(11); // EJE 11
      setFormTitle('Invitación a la Subsecretaria para América del Norte para Foro de Comercio Internacional DFW');
      setFormSource('World Affairs Council of Dallas/Fort Worth');
      setFormLocation('Dallas, TX');
      setFormSummary('El World Affairs Council de DFW extiende atenta invitación a la Titular de la SSAN para participar como oradora principal en la Cumbre de Líderes de América del Norte a celebrarse en Dallas.');
      setFormActors('Liz Brailsford (Presidenta WAC DFW), Titular de la SSAN');
      setFormBilateralImplication('Oportunidad estratégica de alta visibilidad para posicionar las prioridades del Gobierno de México ante más de 400 líderes empresariales y tomadores de decisiones de Texas.');
      setFormImpactLevel('Alto');
      setFormStrategicTendency('Oportunidad / Cooperación');
      setFormSuggestedAction('Retransmitir formalmente el oficio de invitación a la Subsecretaría para América del Norte (SSAN) y a la DGEDAN para su valoración.');
    } else if (type === 'visit') {
      setFormCategoryId(8); // EJE 8
      setFormTitle('Visita de trabajo de Delegación del Gobierno de Guanajuato y Clúster Automotriz a Arlington y Plano');
      setFormSource('Agenda Institucional Consular');
      setFormLocation('Arlington / Plano, TX');
      setFormSummary('Misión de vinculación económica y atracción de inversiones para proveedores automotrices y cadenas de valor de vehículos eléctricos con armadoras y plantas de manufactura en el norte de Texas.');
      setFormActors('Secretario de Desarrollo Económico Sustentable, Representantes de la Misión Consular');
      setFormBilateralImplication('Fortalecimiento de las cadenas de suministro binacionales automotrices bajo las reglas de origen del T-MEC.');
      setFormImpactLevel('Medio');
      setFormStrategicTendency('Oportunidad / Cooperación');
      setFormSuggestedAction('Acompañamiento institucional en las reuniones de trabajo y reporte de compromisos a la DGEDAN.');
    } else if (type === 'airline') {
      setFormCategoryId(10); // EJE 10
      setFormTitle('Propuesta para apertura de nueva ruta aérea directa DFW - San Luis Potosí para carga y pasajeros');
      setFormSource('DFW International Airport Air Service Development');
      setFormLocation('DFW Airport, TX');
      setFormSummary('La gerencia de desarrollo de rutas del Aeropuerto DFW presentó estudio de viabilidad para establecer conexión aérea directa con el Bajío mexicano orientada al clúster industrial de manufactura y turismo.');
      setFormActors('Gerencia de Rutas DFW Airport, Aerolíneas participantes');
      setFormBilateralImplication('Impulso al intercambio comercial y logístico entre el hub de distribución más grande del sur de EE.UU. y el centro industrial de México.');
      setFormImpactLevel('Medio');
      setFormStrategicTendency('Oportunidad / Cooperación');
      setFormSuggestedAction('Canalizar la propuesta a la Dirección General para enlace con la Agencia Federal de Aviación Civil (AFAC) y SECTUR.');
    } else if (type === 'meeting') {
      setFormCategoryId(9); // EJE 9
      setFormTitle('Reunión de trabajo con el Juez de Condado de Dallas sobre colaboración comunitaria y desarrollo');
      setFormSource('Oficina del Juez de Condado de Dallas');
      setFormLocation('Dallas County Administration Building');
      setFormSummary('Encuentro institucional para dar seguimiento a temas de vinculación con la comunidad mexicana, acceso a programas locales y fortalecimiento de relaciones con alcaldías del condado.');
      setFormActors('Juez de Condado de Dallas, Cónsul General');
      setFormBilateralImplication('Consolidación del diálogo político a nivel condal y protección de derechos de connacionales residentes en el Condado de Dallas.');
      setFormImpactLevel('Medio');
      setFormStrategicTendency('Seguimiento / Neutro');
      setFormSuggestedAction('Mantener canal de comunicación directo para asuntos de interés comunitario y remitir minuta de acuerdos a DGEDAN.');
    }
  };

  const handleAIAnalyze = async () => {
    if (!rawText.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-custom-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          sourceUrl,
          manualTitle,
        }),
      });
      const data = await response.json();
      if (data.success && data.article) {
        setAnalyzedArticle(data.article);
      }
    } catch (err) {
      console.error('Error analyzing news:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAddAnalyzed = () => {
    if (!analyzedArticle) return;
    onAddArticle(analyzedArticle);
    setAnalyzedArticle(null);
    setRawText('');
    setSourceUrl('');
    setManualTitle('');
    setIsAddedSuccess(true);
    setTimeout(() => setIsAddedSuccess(false), 3000);
  };

  const handleConfirmManualForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) return;

    const actorsList = formActors
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const newArticle: PressArticle = {
      id: `manual-entry-${Date.now()}`,
      title: formTitle,
      source: formSource,
      sourceUrl: sourceUrl || undefined,
      date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      categoryIds: [formCategoryId],
      primaryCategoryId: formCategoryId,
      location: formLocation,
      summary: formSummary,
      keyActors: actorsList,
      bilateralImplication: formBilateralImplication || 'Asunto relevante para seguimiento de la agenda bilateral.',
      impactLevel: formImpactLevel,
      strategicTendency: formStrategicTendency,
      suggestedAction: formSuggestedAction || 'Seguimiento por parte de la DGEDAN.',
      verified: true,
      isCustomManual: true,
      selectedForReport: true,
    };

    onAddArticle(newArticle);
    setFormTitle('');
    setFormSummary('');
    setFormActors('');
    setFormBilateralImplication('');
    setFormSuggestedAction('');
    setIsAddedSuccess(true);
    setTimeout(() => setIsAddedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#0c2340] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#00472e]" />
              <span>Ingreso y Análisis Estratégico de Notas y Acontecimientos</span>
            </h2>
            <p className="text-xs text-[#64748b] mt-1">
              Ingresa artículos de prensa de Texas, discursos de autoridades, notas diplomáticas o invitaciones institucionales para clasificarlas en los 13 ejes de la DGEDAN.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#f0f2f5] p-1 rounded-lg border border-[#cbd5e1] text-xs font-semibold">
            <button
              onClick={() => setIngestMode('ai-parse')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                ingestMode === 'ai-parse'
                  ? 'bg-[#0c2340] text-white shadow-xs font-bold'
                  : 'text-[#64748b] hover:text-[#0c2340]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className={`w-3.5 h-3.5 ${ingestMode === 'ai-parse' ? 'text-[#b5a269]' : 'text-[#64748b]'}`} />
                <span>Analizador IA con Gemini</span>
              </span>
            </button>
            <button
              onClick={() => setIngestMode('manual-form')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                ingestMode === 'manual-form'
                  ? 'bg-[#0c2340] text-white shadow-xs font-bold'
                  : 'text-[#64748b] hover:text-[#0c2340]'
              }`}
            >
              <span>Formulario Directo</span>
            </button>
          </div>
        </div>

        {/* Quick Diplomatic Templates */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2 font-mono">
            Plantillas Rápidas para Casos Típicos en Norte de Texas:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleApplyTemplate('invitation')}
              className="text-xs px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md font-medium transition-colors"
            >
              ✉️ Invitación Institucional para SSAN (Eje 11)
            </button>
            <button
              onClick={() => handleApplyTemplate('visit')}
              className="text-xs px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-md font-medium transition-colors"
            >
              🇲🇽 Visita de Autoridad Mexicana a DFW (Eje 8)
            </button>
            <button
              onClick={() => handleApplyTemplate('airline')}
              className="text-xs px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-md font-medium transition-colors"
            >
              ✈️ Conectividad / Rutas Aéreas DFW (Eje 10)
            </button>
            <button
              onClick={() => handleApplyTemplate('meeting')}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#0c2340] border border-[#cbd5e1] rounded-md font-medium transition-colors"
            >
              🏛️ Reunión con Juez / Alcalde de DFW (Eje 9)
            </button>
          </div>
        </div>
      </div>

      {isAddedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-[#00472e]" />
          <span>¡La nota ha sido clasificada y agregada exitosamente al Monitor y al Despacho Oficial del día!</span>
        </div>
      )}

      {/* AI Parsing Mode */}
      {ingestMode === 'ai-parse' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0c2340] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#b5a269]" />
              <span>Pegar Texto de Prensa o Declaración</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Título opcional o encabezado:
              </label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Ej. Gobernador de Texas emite directiva sobre transporte comercial..."
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#475569]">
                  Fuente original o enlace web (URL):
                </label>
                <span className="text-[10px] text-[#00472e] font-bold">Enlaces Verificados</span>
              </div>
              <input
                type="text"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="Ej. https://www.dallasnews.com/ o https://www.texastribune.org"
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340]"
              />
              {/* Quick source pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { name: 'Dallas Morning News', url: 'https://www.dallasnews.com' },
                  { name: 'Texas Tribune', url: 'https://www.texastribune.org' },
                  { name: 'Dallas Fed', url: 'https://www.dallasfed.org/research' },
                  { name: 'Fort Worth Report', url: 'https://fortworthreport.org' },
                  { name: 'SMU Tower Center', url: 'https://www.smu.edu/towercenter' },
                  { name: 'DFW Airport', url: 'https://www.dfwairport.com' },
                  { name: 'Consulado Dallas (SRE)', url: 'https://consulmex.sre.gob.mx/dallas/' },
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSourceUrl(s.url)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[#0c2340] border border-[#cbd5e1] font-medium transition-colors"
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Contenido completo de la nota o comunicado:
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={8}
                placeholder="Pega aquí el texto completo del artículo, nota de prensa, comunicado de la oficina del Gobernador, informe de la Reserva Federal de Dallas o discurso oficial..."
                className="w-full text-xs p-3 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] leading-relaxed"
              />
            </div>

            <button
              id="btn-analyze-text"
              onClick={handleAIAnalyze}
              disabled={isAnalyzing || !rawText.trim()}
              className="w-full py-2.5 bg-[#00472e] hover:bg-[#003622] disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className={`w-4 h-4 text-[#b5a269] ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analizando con Gemini y Clasificando en Ejes DGEDAN...' : 'Analizar y Clasificar con Inteligencia Artificial'}</span>
            </button>
          </div>

          {/* AI Result Preview */}
          <div className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0c2340] flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#0c2340]" />
                <span>Resultado del Análisis Diplomático</span>
              </h3>

              {analyzedArticle ? (
                <div className="space-y-3 bg-[#f0f2f5] border border-[#cbd5e1] rounded-lg p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold bg-[#0c2340] text-[#b5a269] px-2 py-0.5 rounded text-[11px]">
                      EJE-{analyzedArticle.primaryCategoryId < 10 ? `0${analyzedArticle.primaryCategoryId}` : analyzedArticle.primaryCategoryId}: {DGEDAN_CATEGORIES.find(c => c.id === analyzedArticle.primaryCategoryId)?.name}
                    </span>
                    <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Impacto {analyzedArticle.impactLevel}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-[#0c2340] mt-1">
                    {analyzedArticle.title}
                  </div>

                  <div className="text-[#64748b] text-[11px]">
                    <strong>Ubicación:</strong> {analyzedArticle.location} | <strong>Tendencia:</strong> {analyzedArticle.strategicTendency}
                  </div>

                  <div>
                    <span className="font-bold text-[#475569] block mb-0.5">Resumen Ejecutivo:</span>
                    <p className="text-[#1e293b] leading-relaxed bg-white p-2 rounded border border-[#cbd5e1]">
                      {analyzedArticle.summary}
                    </p>
                  </div>

                  {analyzedArticle.keyActors && analyzedArticle.keyActors.length > 0 && (
                    <div>
                      <span className="font-bold text-[#475569] block mb-1">Actores Clave:</span>
                      <div className="flex flex-wrap gap-1">
                        {analyzedArticle.keyActors.map((actor, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-[#0c2340] rounded border border-[#cbd5e1] text-[11px] font-medium">
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="font-bold text-[#0c2340] block mb-0.5">Implicación Bilateral para México:</span>
                    <p className="text-[#1e293b] leading-relaxed bg-white p-2 rounded border-l-2 border-[#b5a269] border-y border-r border-[#cbd5e1]">
                      {analyzedArticle.bilateralImplication}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-[#00472e] block mb-0.5">Recomendación Operativa:</span>
                    <p className="text-[#1e293b] leading-relaxed bg-white p-2 rounded border-l-2 border-[#00472e] border-y border-r border-[#cbd5e1]">
                      {analyzedArticle.suggestedAction}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#cbd5e1] rounded-lg p-10 text-center text-[#94a3b8] space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-[#cbd5e1]" />
                  <p className="text-xs">
                    Pega una nota de prensa a la izquierda y presiona <strong>&quot;Analizar y Clasificar&quot;</strong> para ver el desglose estratégico automatizado.
                  </p>
                </div>
              )}
            </div>

            {analyzedArticle && (
              <button
                id="btn-confirm-add-article"
                onClick={handleConfirmAddAnalyzed}
                className="w-full py-2.5 bg-[#00472e] hover:bg-[#003622] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-[#b5a269]" />
                <span>Agregar Nota Clasificada al Monitor y Despacho del Día</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Manual Form Mode */
        <form onSubmit={handleConfirmManualForm} className="bg-white border border-[#cbd5e1] rounded-xl p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Título del Acontecimiento o Nota: *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ej. Reunión de trabajo entre Cónsul General y Alcalde de Dallas sobre comercio bilateral"
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Eje Temático Principal DGEDAN: *
              </label>
              <select
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20 font-medium"
              >
                {DGEDAN_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.code}: {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Ubicación en Norte de Texas:
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="Ej. Dallas, TX / Fort Worth, TX / DFW Airport / Plano"
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Fuente o Medio:
              </label>
              <input
                type="text"
                value={formSource}
                onChange={(e) => setFormSource(e.target.value)}
                placeholder="Ej. Dallas Morning News / Comunicado Oficial / Minuta Consular"
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Actores Clave (separados por coma):
              </label>
              <input
                type="text"
                value={formActors}
                onChange={(e) => setFormActors(e.target.value)}
                placeholder="Ej. Greg Abbott, Eric Johnson, Embajada, Secretaría de Economía"
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Nivel de Impacto:
              </label>
              <select
                value={formImpactLevel}
                onChange={(e) => setFormImpactLevel(e.target.value as ImpactLevel)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20"
              >
                <option value="Alto">Alto Impacto</option>
                <option value="Medio">Medio Impacto</option>
                <option value="Bajo">Bajo Impacto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Tendencia Estratégica:
              </label>
              <select
                value={formStrategicTendency}
                onChange={(e) => setFormStrategicTendency(e.target.value as StrategicTendency)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20"
              >
                <option value="Oportunidad / Cooperación">Oportunidad / Cooperación</option>
                <option value="Riesgo / Tensión">Riesgo / Tensión</option>
                <option value="Seguimiento / Neutro">Seguimiento / Neutro</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Resumen del Acontecimiento: *
              </label>
              <textarea
                required
                rows={3}
                value={formSummary}
                onChange={(e) => setFormSummary(e.target.value)}
                placeholder="Describe con claridad y concisión los hechos ocurridos..."
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20 leading-relaxed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Implicaciones Estratégicas para México:
              </label>
              <textarea
                rows={2}
                value={formBilateralImplication}
                onChange={(e) => setFormBilateralImplication(e.target.value)}
                placeholder="Impacto en el T-MEC, comercio, comunidad mexicana, agenda trilateral o política..."
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20 leading-relaxed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#0c2340] mb-1">
                Recomendación de Acción para la Representación / SRE:
              </label>
              <textarea
                rows={2}
                value={formSuggestedAction}
                onChange={(e) => setFormSuggestedAction(e.target.value)}
                placeholder="Acciones sugeridas: retransmitir a SSAN, emitir nota diplomática, concertar reunión..."
                className="w-full text-xs p-2.5 rounded-lg border border-[#cbd5e1] focus:ring-2 focus:ring-[#0c2340]/20 leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#cbd5e1] flex justify-end">
            <button
              id="btn-submit-manual-form"
              type="submit"
              className="px-5 py-2.5 bg-[#00472e] hover:bg-[#003622] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-[#b5a269]" />
              <span>Guardar e Incluir en el Despacho Oficial</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
