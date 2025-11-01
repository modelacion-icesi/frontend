// src/pages/MixedRateAmortizationPage.tsx
import React from "react";
import { MixedRateAmortizationForm } from "@/features/mixed-rate-amortization/components/MixedRateAmortizationForm";
import { useMixedRateAmortization } from "@/features/mixed-rate-amortization/hooks/useMixedRateAmortization";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Importamos la definición de columnas
import { mixedRateAmortizationColumns } from "@/features/mixed-rate-amortization/components/mixedRateAmortizationColumns";

const MixedRateAmortizationPage = () => {
  // 1. Hook
  const { calculate, responseData, isPending, isError, error } =
    useMixedRateAmortization();

  // 2. Extraer datos
  const amortizationTableData = responseData?.rows || [];
  const summary = responseData?.summary;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Calculadora de Amortización (Tasa Mixta)
      </h1>

      {/* 3. Formulario */}
      <MixedRateAmortizationForm onSubmit={calculate} isPending={isPending} />

      {/* 4. Error */}
      {isError && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error al Calcular</AlertTitle>
          <AlertDescription>
            {error?.message || "Ocurrió un error inesperado."}
          </AlertDescription>
        </Alert>
      )}

      {/* 5. Resultados */}
      {responseData && !isPending && (
        <React.Fragment>
          {/* Resumen/Totales */}
          {summary && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Resumen del Crédito</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Cuotas Fijas
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.total_fixed_payment)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Intereses
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.total_interest)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Capital Pagado
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.capital_payment)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabla de Amortización */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Tabla de Amortización</h2>
            <DataTable
              columns={mixedRateAmortizationColumns}
              data={amortizationTableData}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default MixedRateAmortizationPage;
