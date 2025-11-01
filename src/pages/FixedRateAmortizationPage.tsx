// src/pages/FixedRateAmortizationPage.tsx
import { FixedRateAmortizationForm } from "@/features/fixed-rate-amortization/components/FixedRateAmortizationForm";
import { useFixedRateAmortization } from "@/features/fixed-rate-amortization/hooks/useFixedRateAmortization";
import { fixedRateAmortizationColumns } from "@/features/fixed-rate-amortization/components/fixedRateAmortizationColumns";
import { annualSummaryColumns } from "@/features/fixed-rate-amortization/components/annualSummaryColumns";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import React from "react"; // Necesario para los fragmentos

const FixedRateAmortizationPage = () => {
  // 1. Obtenemos la lógica desde el hook
  const { calculate, responseData, isPending, isError, error } =
    useFixedRateAmortization();

  // 2. Extraemos los datos para las tablas
  const amortizationTableData = responseData?.amortization_table.rows || [];
  const annualSummaryData = responseData?.annual_summary.rows || [];
  const totals = responseData?.amortization_table.totals;
  // (Opcional) Otros datos como la tasa convertida
  // const convertedRate = responseData?.amortization_table.converted_rate;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Calculadora de Amortización (Tasa Fija)
      </h1>

      {/* 3. Renderizamos el formulario */}
      <FixedRateAmortizationForm onSubmit={calculate} isPending={isPending} />

      {/* 4. Manejo de Errores */}
      {isError && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error al Calcular</AlertTitle>
          <AlertDescription>
            {error?.message || "Ocurrió un error inesperado."}
          </AlertDescription>
        </Alert>
      )}

      {/* 5. Renderizamos los resultados si existen */}
      {responseData && !isPending && (
        <React.Fragment>
          {/* Resumen de Totales */}
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

          {/* Tabla de Amortización Detallada */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Tabla de Amortización</h2>
            <DataTable
              columns={fixedRateAmortizationColumns}
              data={amortizationTableData}
            />
          </div>

          {/* Resumen Anual */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Resumen Anual</h2>
            <DataTable
              columns={annualSummaryColumns}
              data={annualSummaryData}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default FixedRateAmortizationPage;
