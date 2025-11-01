// src/features/geometric-amortization/hooks/useGeometricAmortization.ts
import { useMutation } from '@tanstack/react-query';
import {
    amortizationService,
    type CleanGeometricAmortizationData,
} from '@/services/amortization.service';
import type { GeometricAmortizationRequest } from '@/types/api.dto';

export const useGeometricAmortization = () => {
    const mutation = useMutation<
        CleanGeometricAmortizationData, // Tipo de dato que retorna (Data Limpia)
        Error, // Tipo del Error
        GeometricAmortizationRequest // Tipo de la variable (Request DTO)
    >({
        mutationKey: ['calculateGeometricAmortization'], // Clave de la mutación
        mutationFn: (data) =>
            amortizationService.calculateGeometricAmortization(data),
    });

    return {
        // Exponemos la data limpia
        amortizationData: mutation.data,
        // Exponemos el estado de la mutación
        calculate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};