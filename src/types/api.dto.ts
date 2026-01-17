// src/types/api.dto.ts
import type { PeriodType, RateType } from '@/constants/finance.constants';

// --- Schemas Base ---

export interface Rate {
    value: number;
    type: RateType;
    period?: PeriodType | null;
}

export interface RatePeriod {
    start_period: number;
    interest_rate: number;
    rate_type: RateType;
    rate_period?: PeriodType | null;
}

// --- DTOs por Endpoint ---

// 1. Convert Interest Rate
export interface RateConversionRequest {
    initial_rate: Rate;
    target_type: RateType;
    target_duration: PeriodType;
}

export type RateConversionResponse = Rate;

// ... (Todos los DTOs anteriores) ...

// --- 2. Geometric Amortization ---
export interface GeometricAmortizationRequest {
    VP: number; // Valor Presente
    i: number; // Tasa de interés mensual (decimal)
    nper: number; // Número de períodos (meses)
    g: number; // Gradiente geométrico (decimal)
}

type GeometricColumn = [number, number][];

export interface GeometricAnnualSummaryRow {
    year: number;
    total_payment: number;
    total_interest: number;
    total_principal: number;
    final_balance: number;
}

export interface ApiGeometricAmortizationResponse {
    amortization: {
        period: GeometricColumn;
        initial_balance: GeometricColumn;
        payment: GeometricColumn;
        interest: GeometricColumn;
        principal: GeometricColumn;
        final_balance: GeometricColumn;
    };
    total_interest: number;
    total_paid: number;
    // --- ✨ TIPO ACTUALIZADO ---
    annual_summary: GeometricAnnualSummaryRow[];
}

// 3. Fixed Rate Amortization
export interface FixedRateAmortizationRequest {
    credit_amount: number;
    duration_years: number;
    start_date: string; // "YYYY-MM-DD"
    interest_rate: number;
    rate_type: RateType;
    rate_period?: PeriodType;
    payment_period: PeriodType;
}

export interface FixedRateAmortizationRow {
    period: number;
    date: string; // "YYYY-MM-DD"
    year: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
}

export interface FixedRateAnnualSummaryRow {
    year: number;
    annual_payments: number;
    annual_interest: number;
    annual_principal: number;
    annual_balance: number;
}

export interface ApiFixedRateAmortizationResponse {
    amortization_table: {
        rows: FixedRateAmortizationRow[];
        totals: {
            total_payments: number;
            total_interest: number;
            total_principal: number;
        };
        // ... otros campos como converted_rate
    };
    annual_summary: {
        rows: FixedRateAnnualSummaryRow[];
    };
}

// 4. Variable Rate Amortization
export interface VariableRateAmortizationRequest {
    credit_amount: number;
    duration_years: number;
    start_date: string; // "YYYY-MM-DD"
    payment_period: PeriodType;
    rate_changes: RatePeriod[];
}

export interface VariableRateAmortizationRow {
    period: number;
    date: string; // "YYYY-MM-DD"
    year: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
    current_rate: number;
    rate_label: string;
}

export interface VariableRateChangeSummary {
    start_period: number;
    end_period: number;
    periods_count: number;
    rate_percentage: number;
    rate_label: string;
}

export interface ApiVariableRateAmortizationResponse {
    amortization_table: {
        rows: VariableRateAmortizationRow[];
        totals: {
            total_payments: number;
            total_interest: number;
            total_principal: number;
        };
    };
    annual_summary: {
        rows: FixedRateAnnualSummaryRow[]; // Reutilizamos el tipo de fixed rate
    };
    rate_changes_summary: VariableRateChangeSummary[];
}

// 5. Linear Gradient Amortization
export interface LinearGradientInput {
    credit_present_value: number;
    duration_years: number;
    start_date: string; // "YYYY-MM-DD"
    gradient: number;
    base_payment: number;
    interest_rate: number;
    rate_type: RateType;
    rate_period?: PeriodType | null;
    gradient_period: PeriodType;
}

export interface LinearGradientAmortizationRow {
    period_label: string;
    date: string; // "YYYY-MM-DD"
    year: number;
    gradient_series: string | number;
    interest: number | null;
    principal_payment: number | null;
    balance?: number;
}

export interface ApiLinearGradientAmortizationResponse {
    linear_amortization_table: {
        rows: LinearGradientAmortizationRow[];
        totals: {
            total_gradient_series: number;
            total_interest: number;
            total_principal_payment: number;
        };
        // ... otros campos
    };
    annual_summary: {
        rows: FixedRateAnnualSummaryRow[]; // Reutilizamos
    };
}

// 6. Mixed Rate Amortization
export interface MixedRateAmortizationInput {
    start_date: string; // "YYYY-MM-DD"
    n_term_in_years: number;
    rate: Rate;
    credit_amount: number;
}

export interface MixedRateAmortizationRow {
    month: number;
    date: string; // "YYYY-MM-DD"
    inflation_monthly: Rate;
    global_rate_monthly: Rate;
    remaining_payment_number: number;
    fixed_payment: number;
    interest_payment: number;
    capital_payment: number;
    balance: number;
}

export interface MixedRateAmortizationSummary {
    total_fixed_payment: number;
    total_interest: number;
    capital_payment: number;
}

export interface ApiAmortizationResponse { // Nombre genérico del OAS
    rows: MixedRateAmortizationRow[];
    summary: MixedRateAmortizationSummary;
}