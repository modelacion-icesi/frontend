// src/features/rate-converter/hooks/useRateConverter.ts
import { useMutation } from '@tanstack/react-query';
import { amortizationService } from '@/services/amortization.service';
import type {
    RateConversionRequest,
    RateConversionResponse,
} from '@/types/api.dto';

export const useRateConverter = () => {
    const mutation = useMutation<
        RateConversionResponse,
        Error,
        RateConversionRequest
    >({
        mutationKey: ['convertRate'],
        mutationFn: (data) => amortizationService.convertRate(data),
    });

    return {
        responseData: mutation.data,
        calculate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};