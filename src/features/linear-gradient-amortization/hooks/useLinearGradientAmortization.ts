// src/features/linear-gradient-amortization/hooks/useLinearGradientAmortization.ts
import { useMutation } from '@tanstack/react-query';
import { amortizationService } from '@/services/amortization.service';
import type {
    ApiLinearGradientAmortizationResponse,
    LinearGradientInput,
} from '@/types/api.dto';

export const useLinearGradientAmortization = () => {
    const mutation = useMutation<
        ApiLinearGradientAmortizationResponse,
        Error,
        LinearGradientInput
    >({
        mutationKey: ['calculateLinearGradientAmortization'],
        mutationFn: (data) =>
            amortizationService.calculateLinearGradientAmortization(data),
    });

    return {
        responseData: mutation.data,
        calculate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};