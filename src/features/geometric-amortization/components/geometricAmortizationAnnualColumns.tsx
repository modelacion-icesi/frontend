// src/features/geometric-amortization/components/geometricAmortizationAnnualColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { GeometricAnnualSummaryRow } from "@/types/api.dto";
import { formatCurrency } from "@/lib/utils";

type RowData = GeometricAnnualSummaryRow;

export const geometricAmortizationAnnualColumns: ColumnDef<RowData>[] = [
  {
    accessorKey: "year",
    header: "Año",
  },
  {
    accessorKey: "total_payment",
    header: "Pago Total Anual",
    cell: ({ row }) => formatCurrency(row.getValue("total_payment")),
  },
  {
    accessorKey: "total_interest",
    header: "Interés Total Anual",
    cell: ({ row }) => formatCurrency(row.getValue("total_interest")),
  },
  {
    accessorKey: "total_principal",
    header: "Capital Total Anual",
    cell: ({ row }) => formatCurrency(row.getValue("total_principal")),
  },
  {
    accessorKey: "final_balance",
    header: "Saldo Final Año",
    cell: ({ row }) => formatCurrency(row.getValue("final_balance")),
  },
];
