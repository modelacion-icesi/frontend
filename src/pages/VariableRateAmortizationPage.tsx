// src/pages/VariableRateAmortizationPage.tsx
import React from "react";
import { VariableRateAmortizationForm } from "@/features/variable-rate-amortization/components/VariableRateAmortizationForm";
import { useVariableRateAmortization } from "@/features/variable-rate-amortization/hooks/useVariableRateAmortization";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Importamos las TRES definiciones de columnas
import { variableRateAmortizationColumns } from "@/features/variable-rate-amortization/components/variableRateAmortizationColumns";
import { annualSummaryColumns } from "@/features/fixed-rate-amortization/components/annualSummaryColumns"; // REUTILIZAMOS
import { rateChangesSummaryColumns } from "@/features/variable-rate-amortization/components/rateChangesSummaryColumns";

const VariableRateAmortizationPage = () => {
  // 1. Hook
  const { calculate, responseData, isPending, isError, error } =
    useVariableRateAmortization();

  // 2. Extraer datos
  const amortizationTableData = responseData?.amortization_table.rows || [];
  const annualSummaryData = responseData?.annual_summary.rows || [];
  const rateChangesSummaryData = responseData?.rate_changes_summary || [];
  const totals = responseData?.amortization_table.totals;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Calculadora de Amortización (Tasa Variable)
      </h1>

      {/* 3. Formulario */}
      <VariableRateAmortizationForm
        onSubmit={calculate}
        isPending={isPending}
      />

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
          {/* Totales */}
          {totals && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Totales del Crédito</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Pagado</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totals.total_payments)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Intereses
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totals.total_interest)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Capital</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totals.total_principal)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabla 1: Resumen de Cambios de Tasa */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Resumen de Cambios de Tasa
            </h2>
            <DataTable
              columns={rateChangesSummaryColumns}
              data={rateChangesSummaryData}
            />
          </div>

          {/* Tabla 2: Tabla de Amortización Detallada */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Tabla de Amortización</h2>
            <DataTable
              columns={variableRateAmortizationColumns}
              data={amortizationTableData}
            />
          </div>

          {/* Tabla 3: Resumen Anual */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Resumen Anual</h2>
            <DataTable
              columns={annualSummaryColumns} // Reutilizada
              data={annualSummaryData}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default VariableRateAmortizationPage;
