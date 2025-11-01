// src/features/fixed-rate-amortization/hooks/useFixedRateAmortization.ts
import { useMutation } from '@tanstack/react-query';
import { amortizationService } from '@/services/amortization.service';
import type {
    ApiFixedRateAmortizationResponse,
    FixedRateAmortizationRequest,
} from '@/types/api.dto';

export const useFixedRateAmortization = () => {
    const mutation = useMutation<
        ApiFixedRateAmortizationResponse,
        Error,
        FixedRateAmortizationRequest
    >({
        mutationKey: ['calculateFixedRateAmortization'],
        mutationFn: (data) =>
            amortizationService.calculateFixedRateAmortization(data),
    });

    return {
        // Exponemos la data cruda de la API
        responseData: mutation.data,
        calculate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};