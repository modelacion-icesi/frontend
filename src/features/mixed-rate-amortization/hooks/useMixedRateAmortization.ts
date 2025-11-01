// src/features/mixed-rate-amortization/hooks/useMixedRateAmortization.ts
import { useMutation } from '@tanstack/react-query';
import { amortizationService } from '@/services/amortization.service';
import type {
    ApiAmortizationResponse,
    MixedRateAmortizationInput,
} from '@/types/api.dto';

export const useMixedRateAmortization = () => {
    const mutation = useMutation<
        ApiAmortizationResponse,
        Error,
        MixedRateAmortizationInput
    >({
        mutationKey: ['generateMixedRateAmortization'],
        mutationFn: (data) =>
            amortizationService.generateMixedRateAmortization(data),
    });

    return {
        responseData: mutation.data,
        calculate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};