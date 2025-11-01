// src/features/variable-rate-amortization/hooks/useVariableRateAmortization.ts
import { useMutation } from '@tanstack/react-query';
import { amortizationService } from '@/services/amortization.service';
import type {
    ApiVariableRateAmortizationResponse,
    VariableRateAmortizationRequest,
} from '@/types/api.dto';

export const useVariableRateAmortization = () => {
    const mutation = useMutation<
        ApiVariableRateAmortizationResponse,
        Error,
        VariableRateAmortizationRequest
    >({
        mutationKey: ['calculateVariableRateAmortization'],
        mutationFn: (data) =>
            amortizationService.calculateVariableRateAmortization(data),
    });

    return {
        responseData: mutation.data,
        calculate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};