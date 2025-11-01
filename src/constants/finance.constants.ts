/**
 * Tipos de Periodo (Frecuencia)
 * Basado en el schema PeriodType del OAS
 */
export const PERIOD_TYPES = [
    'DIARIA',
    'SEMANAL',
    'QUINCENAL',
    'MENSUAL',
    'BIMESTRAL',
    'TRIMESTRAL',
    'CUATRIMESTRAL',
    'SEMESTRAL',
    'ANUAL',
] as const;

/**
 * Tipos de Tasa de Interés
 * Basado en el schema RateType del OAS
 */
export const RATE_TYPES = [
    'EFECTIVA_ANUAL',
    'NOMINAL_VENCIDA',
    'NOMINAL_ANTICIPADA',
    'PERIODICA_VENCIDA',
    'PERIODICA_ANTICIPADA',
] as const;

// Opcional: Mapas para mostrar etiquetas legibles en la UI
export const PERIOD_TYPE_LABELS: Record<PeriodType, string> = {
    DIARIA: 'Diaria',
    SEMANAL: 'Semanal',
    QUINCENAL: 'Quincenal',
    MENSUAL: 'Mensual',
    BIMESTRAL: 'Bimestral',
    TRIMESTRAL: 'Trimestral',
    CUATRIMESTRAL: 'Cuatrimestral',
    SEMESTRAL: 'Semestral',
    ANUAL: 'Anual',
};

export const RATE_TYPE_LABELS: Record<RateType, string> = {
    EFECTIVA_ANUAL: 'Efectiva Anual',
    NOMINAL_VENCIDA: 'Nominal Vencida',
    NOMINAL_ANTICIPADA: 'Nominal Anticipada',
    PERIODICA_VENCIDA: 'Periódica Vencida',
    PERIODICA_ANTICIPADA: 'Periódica Anticipada',
};

// Generamos los tipos a partir de las constantes
// Esto es para no tener que declararlos dos veces
export type PeriodType = (typeof PERIOD_TYPES)[number];
export type RateType = (typeof RATE_TYPES)[number];