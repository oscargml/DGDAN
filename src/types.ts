export interface DiplomaticCategory {
  id: number;
  code: string;
  name: string;
  shortDescription: string;
  iconName: string;
  color: string;
}

export const DGEDAN_CATEGORIES: DiplomaticCategory[] = [
  {
    id: 1,
    code: 'EJE-01',
    name: 'Actividades y Posicionamientos de Autoridades',
    shortDescription: 'Visitas, anuncios o posicionamientos de autoridades federales, estatales o locales de EE.UU. o Canadá.',
    iconName: 'Building2',
    color: 'blue',
  },
  {
    id: 2,
    code: 'EJE-02',
    name: 'Políticas Públicas, Leyes y Medidas Regulatorias',
    shortDescription: 'Iniciativas legislativas, órdenes ejecutivas, medidas regulatorias o decisiones judiciales con impacto en México.',
    iconName: 'Scale',
    color: 'amber',
  },
  {
    id: 3,
    code: 'EJE-03',
    name: 'Notas Políticas y Análisis de Coyuntura Regional',
    shortDescription: 'Acontecimientos relevantes, dinámicas políticas y sociales en la circunscripción de Norte de Texas.',
    iconName: 'Newspaper',
    color: 'emerald',
  },
  {
    id: 4,
    code: 'EJE-04',
    name: 'Think Tanks y Academia Especializada',
    shortDescription: 'Estudios de Dallas Fed, SMU Tower Center, Baker Institute, UT Dallas, Bush Center y centros de análisis.',
    iconName: 'GraduationCap',
    color: 'indigo',
  },
  {
    id: 5,
    code: 'EJE-05',
    name: 'Pronunciamientos de Actores Políticos Relevantes',
    shortDescription: 'Discursos, entrevistas y declaraciones en redes de líderes políticos de Texas respecto a México.',
    iconName: 'Megaphone',
    color: 'purple',
  },
  {
    id: 6,
    code: 'EJE-06',
    name: 'Nombramientos y Movimientos Políticos',
    shortDescription: 'Cambios en gabinetes federales, estatales o locales con incidencia en la relación bilateral.',
    iconName: 'UserCheck',
    color: 'teal',
  },
  {
    id: 7,
    code: 'EJE-07',
    name: 'Elecciones, Encuestas y Monitoreo Electoral',
    shortDescription: 'Tendencias electorales, encuestas, dinámicas de distritos y monitoreo de comicios en Texas/EE.UU.',
    iconName: 'Vote',
    color: 'rose',
  },
  {
    id: 8,
    code: 'EJE-08',
    name: 'Visitas y Agendas de Autoridades Mexicanas',
    shortDescription: 'Misiones de trabajo, reuniones y giras de funcionarios mexicanos de los 3 órdenes en Norte de Texas.',
    iconName: 'Flag',
    color: 'emerald',
  },
  {
    id: 9,
    code: 'EJE-09',
    name: 'Reuniones con Funcionarios Electos Locales',
    shortDescription: 'Encuentros con jueces de condado, comisionados, alcaldes y concejales de DFW y Norte de Texas.',
    iconName: 'Users',
    color: 'cyan',
  },
  {
    id: 10,
    code: 'EJE-10',
    name: 'Conectividad, Rutas Aéreas y Hermanamientos',
    shortDescription: 'Nuevas rutas aéreas DFW-México, corredores logísticos (I-35, ferroviario) y acuerdos de hermanamiento.',
    iconName: 'Plane',
    color: 'sky',
  },
  {
    id: 11,
    code: 'EJE-11',
    name: 'Invitaciones Institucionales a Retransmitir',
    shortDescription: 'Invitaciones destinadas a la Subsecretaria para América del Norte (SSAN), Canciller o dependencias.',
    iconName: 'MailOpen',
    color: 'orange',
  },
  {
    id: 12,
    code: 'EJE-12',
    name: 'Eventos de Alto Nivel, Foros y Cumbres',
    shortDescription: 'Encuentros bilaterales con cámaras empresariales, cúpulas industriales y sociedad civil en DFW.',
    iconName: 'Globe',
    color: 'violet',
  },
  {
    id: 13,
    code: 'EJE-13',
    name: 'Asuntos Estratégicos Adicionales para DGEDAN',
    shortDescription: 'Cualquier asunto de naturaleza política o estratégica que amerite conocimiento y valoración de DGEDAN.',
    iconName: 'ShieldAlert',
    color: 'red',
  },
];

export type ImpactLevel = 'Alto' | 'Medio' | 'Bajo';
export type StrategicTendency = 'Riesgo / Tensión' | 'Oportunidad / Cooperación' | 'Seguimiento / Neutro';

export interface PressArticle {
  id: string;
  title: string;
  source: string;
  sourceUrl?: string;
  date: string;
  categoryIds: number[];
  primaryCategoryId: number;
  location: string; // e.g. "Dallas, TX", "Fort Worth, TX", "Austin / Norte de TX", "DFW Metroplex"
  summary: string;
  keyActors: string[];
  bilateralImplication: string;
  impactLevel: ImpactLevel;
  strategicTendency: StrategicTendency;
  suggestedAction: string;
  verified: boolean;
  isCustomManual?: boolean;
  selectedForReport?: boolean;
}

export interface DiplomaticCable {
  id: string;
  code: string; // e.g., "DGEDAN-NTX-2026-0901-01"
  date: string;
  jurisdiction: string;
  recipientPrimary: string;
  recipientCC: string;
  subject: string;
  executiveSummary: string;
  articles: PressArticle[];
  strategicRiskAssessment: string;
  bilateralOpportunities: string;
  recommendedRepresentationActions: string;
  author: string;
  createdAt: string;
}

export interface ScannerFilter {
  selectedCategory: number | 'all';
  impactFilter: 'all' | ImpactLevel;
  tendencyFilter: 'all' | StrategicTendency;
  searchQuery: string;
  dateRange: 'today' | 'last3days' | 'lastWeek' | 'all';
}
