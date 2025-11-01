// src/pages/GeometricAmortizationPage.tsx
import React from "react"; // Importar React
import { GeometricAmortizationForm } from "@/features/geometric-amortization/components/GeometricAmortizationForm";
import { useGeometricAmortization } from "@/features/geometric-amortization/hooks/useGeometricAmortization";
import { geometricAmortizationColumns } from "@/features/geometric-amortization/components/geometricAmortizationColumns";
// --- ✨ 1. IMPORTAR LAS NUEVAS COLUMNAS ---
import { geometricAmortizationAnnualColumns } from "@/features/geometric-amortization/components/geometricAmortizationAnnualColumns";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const GeometricAmortizationPage = () => {
  const { calculate, amortizationData, isPending, isError, error } =
    useGeometricAmortization();

  const tableData = amortizationData?.amortizationTable || [];
  // --- ✨ 2. OBTENER DATOS PARA LA SEGUNDA TABLA ---
  const annualSummaryData = amortizationData?.annualSummary || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Calculadora de Amortización Geométrica
      </h1>

      <GeometricAmortizationForm onSubmit={calculate} isPending={isPending} />

      {isError && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error al Calcular</AlertTitle>
          <AlertDescription>
            {error?.message || "Ocurrió un error inesperado."}
          </AlertDescription>
        </Alert>
      )}

      {amortizationData && !isPending && (
        <React.Fragment>
          {/* Resumen de Totales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pagado</p>
              <p className="text-2xl font-bold">
                {formatCurrency(amortizationData.totalPaid)}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Intereses</p>
              <p className="text-2xl font-bold">
                {formatCurrency(amortizationData.totalInterest)}
              </p>
            </div>
          </div>

          {/* Tabla de Amortización */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Tabla de Amortización</h2>
            <DataTable
              columns={geometricAmortizationColumns}
              data={tableData}
            />
          </div>

          {/* --- ✨ 3. RENDERIZAR LA SEGUNDA TABLA --- */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Resumen Anual</h2>
            <DataTable
              columns={geometricAmortizationAnnualColumns}
              data={annualSummaryData}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default GeometricAmortizationPage;
