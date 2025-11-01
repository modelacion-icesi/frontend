import apiClient from './apiClient';
import type {
    ApiGeometricAmortizationResponse,
    ApiFixedRateAmortizationResponse,
    ApiVariableRateAmortizationResponse,
    ApiLinearGradientAmortizationResponse,
    ApiAmortizationResponse,
    GeometricAmortizationRequest,
    GeometricAnnualSummaryRow,
    FixedRateAmortizationRequest,
    VariableRateAmortizationRequest,
    LinearGradientInput,
    MixedRateAmortizationInput,
    RateConversionRequest,
    RateConversionResponse,
} from '@/types/api.dto';

// --- TIPOS LIMPIOS (Para la UI) ---
// Estos son los tipos que nuestra UI *realmente* consumirá.

// Fila limpia para Amortización Geométrica
export interface GeometricAmortizationRow {
    period: number;
    initialBalance: number;
    payment: number;
    interest: number;
    principal: number;
    finalBalance: number;
}

// Respuesta limpia para Amortización Geométrica
export interface CleanGeometricAmortizationData {
    amortizationTable: GeometricAmortizationRow[];
    totalInterest: number;
    totalPaid: number;
    annualSummary: GeometricAnnualSummaryRow[];
}

// --- MAPPERS (Transformadores de Datos) ---

/**
 * Transforma la respuesta "columnar" de la amortización geométrica
 * a una respuesta "tabular" (array de objetos) que TanStack-Table puede usar.
 */
const mapGeometricAmortizationResponse = (
    response: ApiGeometricAmortizationResponse,
): CleanGeometricAmortizationData => {
    const amortizationTable: GeometricAmortizationRow[] = [];
    const { amortization, total_interest, total_paid, annual_summary } = response;

    const numPeriods = amortization.period.length;

    for (let i = 0; i < numPeriods; i++) {
        amortizationTable.push({
            period: amortization.period[i][1],
            initialBalance: amortization.initial_balance[i][1],
            payment: amortization.payment[i][1],
            interest: amortization.interest[i][1],
            principal: amortization.principal[i][1],
            finalBalance: amortization.final_balance[i][1],
        });
    }

    return {
        amortizationTable,
        totalInterest: total_interest,
        totalPaid: total_paid,
        annualSummary: annual_summary, // El mapper solo necesita pasarlo
    };
};

/**
 * Mapper simple para renombrar snake_case a camelCase si fuera necesario.
 * En este caso, las respuestas de Tasa Fija, Variable y Lineal ya 
 * vienen en un formato de 'rows' que es fácil de consumir.
 * Podemos simplemente pasar la data o hacer renombre de claves.
 * Por simplicidad, por ahora pasaremos la data casi directa.
 */

// --- FUNCIONES DEL SERVICIO (API) ---

export const amortizationService = {
    /**
     * 1. Convierte una tasa de interés.
     */
    convertRate: async (
        data: RateConversionRequest,
    ): Promise<RateConversionResponse> => {
        const response = await apiClient.post<RateConversionResponse>(
            '/rates/convert',
            data,
        );
        return response.data;
    },

    /**
     * 2. Calcula la amortización geométrica.
     * Usa el mapper para transformar la respuesta.
     */
    calculateGeometricAmortization: async (
        data: GeometricAmortizationRequest,
    ): Promise<CleanGeometricAmortizationData> => {
        const response = await apiClient.post<ApiGeometricAmortizationResponse>(
            '/geometric-amortization/calculate',
            data,
        );
        // ¡Aquí transformamos la data!
        return mapGeometricAmortizationResponse(response.data);
    },

    /**
     * 3. Calcula la amortización de tasa fija.
     */
    calculateFixedRateAmortization: async (
        data: FixedRateAmortizationRequest,
    ): Promise<ApiFixedRateAmortizationResponse> => {
        const response = await apiClient.post<ApiFixedRateAmortizationResponse>(
            '/fixed-rate-amortization',
            data,
        );
        return response.data; // La respuesta ya es tabular
    },

    /**
     * 4. Calcula la amortización de tasa variable.
     */
    calculateVariableRateAmortization: async (
        data: VariableRateAmortizationRequest,
    ): Promise<ApiVariableRateAmortizationResponse> => {
        const response = await apiClient.post<ApiVariableRateAmortizationResponse>(
            '/variable-rate-amortization',
            data,
        );
        return response.data; // La respuesta ya es tabular
    },

    /**
     * 5. Calcula la amortización de gradiente lineal.
     */
    calculateLinearGradientAmortization: async (
        data: LinearGradientInput,
    ): Promise<ApiLinearGradientAmortizationResponse> => {
        const response = await apiClient.post<ApiLinearGradientAmortizationResponse>(
            '/linear-gradient-amortization',
            data,
        );
        return response.data; // La respuesta ya es tabular
    },

    /**
     * 6. Genera la tabla de amortización de tasa mixta.
     */
    generateMixedRateAmortization: async (
        data: MixedRateAmortizationInput,
    ): Promise<ApiAmortizationResponse> => {
        const response = await apiClient.post<ApiAmortizationResponse>(
            '/amortization-tables/mixed-rate',
            data,
        );
        return response.data; // La respuesta ya es tabular
    },
};