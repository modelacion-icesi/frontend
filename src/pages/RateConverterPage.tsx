// src/pages/RateConverterPage.tsx
import { RateConverterForm } from "@/features/rate-converter/components/RateConverterForm";
import { useRateConverter } from "@/features/rate-converter/hooks/useRateConverter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import type { Rate } from "@/types/api.dto";
import {
  PERIOD_TYPE_LABELS,
  RATE_TYPE_LABELS,
} from "@/constants/finance.constants";

// Helper local para formatear la tasa resultante
const formatRateResult = (rate: Rate): string => {
  const value = rate.value.toFixed(4);
  const type = RATE_TYPE_LABELS[rate.type];

  const period =
    rate.type === "EFECTIVA_ANUAL"
      ? ""
      : rate.period
      ? PERIOD_TYPE_LABELS[rate.period]
      : "";

  return `${value}% ${type} ${period}`.trim();
};

const RateConverterPage = () => {
  // 1. Hook
  const { calculate, responseData, isPending, isError, error } =
    useRateConverter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Conversor de Tasas de Interés</h1>

      {/* 2. Formulario */}
      <RateConverterForm onSubmit={calculate} isPending={isPending} />

      {/* 3. Error */}
      {isError && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error al Convertir</AlertTitle>
          <AlertDescription>
            {error?.message || "Ocurrió un error inesperado."}
          </AlertDescription>
        </Alert>
      )}

      {/* 4. Resultado */}
      {responseData && !isPending && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Resultado</h2>
          <div className="p-6 border rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Tasa Convertida</p>
            <p className="text-3xl font-bold">
              {formatRateResult(responseData)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateConverterPage;
