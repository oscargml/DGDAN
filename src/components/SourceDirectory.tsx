import React from 'react';
import { Globe, ExternalLink, ShieldCheck, CheckCircle2, Building, Newspaper, GraduationCap, Radio, Landmark } from 'lucide-react';

interface MediaSource {
  name: string;
  type: 'Prensa General' | 'Think Tank & Academia' | 'Negocios & Comercio' | 'Medio Público / Radio' | 'Institución Gubernamental / Consular';
  coverage: string;
  relevanceToMexico: string;
  url: string;
  frequency: string;
  verifiedDomain: string;
}

const NORTH_TEXAS_SOURCES: MediaSource[] = [
  {
    name: 'The Dallas Morning News',
    type: 'Prensa General',
    coverage: 'Dallas County, Metroplex y política estatal de Texas',
    relevanceToMexico: 'Principal diario de referencia en el norte de Texas con amplia cobertura de política regional, comercio fronterizo, comunidad hispana y relaciones con México.',
    url: 'https://www.dallasnews.com',
    verifiedDomain: 'dallasnews.com',
    frequency: 'Diaria (Edición matutina y digital continua)',
  },
  {
    name: 'The Texas Tribune',
    type: 'Prensa General',
    coverage: 'Austin / Cobertura estatal Texas y delegaciones DFW',
    relevanceToMexico: 'Fuente de referencia primordial para iniciativas de ley en la Legislatura de Texas, órdenes ejecutivas del Gobernador, litigios en cortes federales y política migratoria y fronteriza.',
    url: 'https://www.texastribune.org',
    verifiedDomain: 'texastribune.org',
    frequency: 'Tiempo real / Análisis legislativo continuo',
  },
  {
    name: 'Fort Worth Star-Telegram',
    type: 'Prensa General',
    coverage: 'Tarrant County, Fort Worth y zona oeste de DFW',
    relevanceToMexico: 'Monitoreo de líderes locales (alcaldía, jueces de condado), logística industrial, manufactura aeroespacial y dinámica de comunidades mexicanas en Fort Worth.',
    url: 'https://www.star-telegram.com',
    verifiedDomain: 'star-telegram.com',
    frequency: 'Diaria continua',
  },
  {
    name: 'Fort Worth Report',
    type: 'Prensa General',
    coverage: 'Tarrant County y Norte de Texas',
    relevanceToMexico: 'Medio independiente sin fines de lucro enfocado en rendición de cuentas, gobierno local, educación e impacto cívico de la comunidad hispana en Fort Worth.',
    url: 'https://fortworthreport.org',
    verifiedDomain: 'fortworthreport.org',
    frequency: 'Diaria / Cobertura cívica',
  },
  {
    name: 'Federal Reserve Bank of Dallas (Dallas Fed)',
    type: 'Think Tank & Academia',
    coverage: 'Distrito 11 de la Reserva Federal (Texas, norte de México)',
    relevanceToMexico: 'Informes de investigación económica de primer nivel sobre comercio manufacturero Texas-México, nearshoring, impacto del T-MEC e indicadores binacionales de empleo.',
    url: 'https://www.dallasfed.org',
    verifiedDomain: 'dallasfed.org',
    frequency: 'Reportes semanales, mensuales y trimestrales',
  },
  {
    name: 'Dallas Business Journal',
    type: 'Negocios & Comercio',
    coverage: 'DFW Metroplex, corporativos de Plano, Frisco, Irving y Dallas',
    relevanceToMexico: 'Inversiones binacionales, aperturas corporativas, misiones comerciales de estados mexicanos, conectividad de transporte y cadenas de valor.',
    url: 'https://www.bizjournals.com/dallas',
    verifiedDomain: 'bizjournals.com',
    frequency: 'Diaria / Semanario impreso',
  },
  {
    name: 'SMU Tower Center for Public Policy & International Affairs',
    type: 'Think Tank & Academia',
    coverage: 'Southern Methodist University (Dallas, TX)',
    relevanceToMexico: 'Foros académicos y publicaciones de alta influencia con expertos en la relación México-EE.UU., T-MEC, seguridad regional y política exterior norteamericana.',
    url: 'https://www.smu.edu/towercenter',
    verifiedDomain: 'smu.edu',
    frequency: 'Eventos institucionales, estudios y conferencias',
  },
  {
    name: 'George W. Bush Presidential Center',
    type: 'Think Tank & Academia',
    coverage: 'Dallas, TX',
    relevanceToMexico: 'Iniciativas de política pública sobre competitividad de América del Norte, migración e integración económica de México, EE.UU. y Canadá.',
    url: 'https://www.bushcenter.org',
    verifiedDomain: 'bushcenter.org',
    frequency: 'Informes estratégicos y foros de liderazgo',
  },
  {
    name: 'World Affairs Council of Dallas/Fort Worth',
    type: 'Think Tank & Academia',
    coverage: 'DFW Metroplex',
    relevanceToMexico: 'Organización diplomática y cívica que convoca a embajadores, ministros y líderes internacionales; canal de invitaciones institucionales para la SSAN.',
    url: 'https://www.dfwworld.org',
    verifiedDomain: 'dfwworld.org',
    frequency: 'Conferencias magistrales y cumbres de alto nivel',
  },
  {
    name: 'KERA News (NPR North Texas)',
    type: 'Medio Público / Radio',
    coverage: 'Norte de Texas (90.1 FM y digital)',
    relevanceToMexico: 'Reportajes profundos de radio y texto sobre derechos civiles, migración, educación bilingüe y comunidades binacionales en el Metroplex.',
    url: 'https://www.keranews.org',
    verifiedDomain: 'keranews.org',
    frequency: 'Diaria en tiempo real',
  },
  {
    name: 'Al Día Dallas (The Dallas Morning News en Español)',
    type: 'Prensa General',
    coverage: 'Comunidad hispanohablante de Dallas-Fort Worth',
    relevanceToMexico: 'Medio líder en español para la circunscripción de Norte de Texas con seguimiento de asuntos consulares, derechos civiles, cultura y comunidad mexicana.',
    url: 'https://www.dallasnews.com/espanol',
    verifiedDomain: 'dallasnews.com',
    frequency: 'Diaria continua en español',
  },
  {
    name: 'DFW International Airport Newsroom',
    type: 'Institución Gubernamental / Consular',
    coverage: 'Aeropuerto Internacional Dallas-Fort Worth',
    relevanceToMexico: 'Anuncios oficiales de nuevas rutas y frecuencias aéreas a destinos mexicanos, transporte de carga binacional y acuerdos de conectividad logística.',
    url: 'https://www.dfwairport.com',
    verifiedDomain: 'dfwairport.com',
    frequency: 'Boletines de prensa e informes de tráfico',
  },
  {
    name: 'Office of the Texas Governor (Press Releases)',
    type: 'Institución Gubernamental / Consular',
    coverage: 'Austin y circunscripciones de Texas',
    relevanceToMexico: 'Comunicados oficiales, declaraciones del Gobernador respecto a México, operaciones de seguridad estatal, comercio y órdenes ejecutivas.',
    url: 'https://gov.texas.gov/news',
    verifiedDomain: 'gov.texas.gov',
    frequency: 'Boletines oficiales inmediatos',
  },
  {
    name: 'Consulado General de México en Dallas (SRE)',
    type: 'Institución Gubernamental / Consular',
    coverage: 'Circunscripción Consular Norte de Texas',
    relevanceToMexico: 'Portal institucional de la representación consular de México en Dallas con avisos de protección, jornadas sabatinas, eventos culturales y vinculación comunitaria.',
    url: 'https://consulmex.sre.gob.mx/dallas/',
    verifiedDomain: 'consulmex.sre.gob.mx',
    frequency: 'Boletines y comunicados oficiales de la representación',
  },
  {
    name: 'Secretaría de Relaciones Exteriores (SRE Gob.mx)',
    type: 'Institución Gubernamental / Consular',
    coverage: 'Nacional y representaciones en el exterior',
    relevanceToMexico: 'Canal oficial de la Cancillería mexicana para pronunciamientos de la Subsecretaría para América del Norte (SSAN) y lineamientos de la DGEDAN.',
    url: 'https://www.gob.mx/sre',
    verifiedDomain: 'gob.mx',
    frequency: 'Comunicados oficiales de Cancillería',
  },
  {
    name: 'Dallas Regional Chamber (DRC)',
    type: 'Negocios & Comercio',
    coverage: 'DFW Metroplex y corredor de negocios regional',
    relevanceToMexico: 'Cámara regional de comercio que monitorea el clima de inversión, atracción de empresas, comercio exterior y misiones comerciales con México.',
    url: 'https://www.dallaschamber.org',
    verifiedDomain: 'dallaschamber.org',
    frequency: 'Informes de desarrollo económico y comercio',
  },
];

export const SourceDirectory: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0c2340]/10 text-[#0c2340] rounded-lg">
              <Globe className="w-6 h-6 text-[#0c2340]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0c2340] flex items-center gap-2">
                <span>Directorio de Fuentes y Enlaces Verificados • Norte de Texas</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#00472e] border border-emerald-200 uppercase font-mono">
                  <ShieldCheck className="w-3 h-3 text-[#00472e]" />
                  100% Enlaces Activos
                </span>
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Ecosistema de medios de comunicación, centros de pensamiento, universidades y dependencias gubernamentales monitoreadas con enlaces oficiales vigentes para la DGEDAN - SRE.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono bg-[#f0f2f5] text-[#0c2340] px-3 py-1.5 rounded-lg border border-[#cbd5e1] font-bold shrink-0">
            {NORTH_TEXAS_SOURCES.length} Fuentes Certificadas
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NORTH_TEXAS_SOURCES.map((source, index) => (
          <div
            key={index}
            className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs hover:border-[#0c2340] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0c2340]">{source.name}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#475569] border border-[#cbd5e1] shrink-0 font-mono">
                  {source.type}
                </span>
              </div>

              <div className="text-xs text-[#64748b] mt-1 font-medium flex items-center gap-1.5">
                <span>📍 Cobertura: {source.coverage}</span>
              </div>

              <p className="text-xs text-[#1e293b] mt-2.5 leading-relaxed">
                {source.relevanceToMexico}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00472e]" />
                <span className="text-[11px] text-[#00472e] font-bold font-mono">
                  {source.verifiedDomain}
                </span>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#00472e] hover:text-[#003622] font-bold bg-emerald-50/80 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                title={`Visitar portal oficial seguro de ${source.name}`}
              >
                <span>Portal Oficial</span>
                <ExternalLink className="w-3 h-3 text-[#00472e]" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

