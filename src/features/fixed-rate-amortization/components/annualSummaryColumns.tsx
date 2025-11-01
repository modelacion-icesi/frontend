// src/features/fixed-rate-amortization/components/annualSummaryColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { FixedRateAnnualSummaryRow } from "@/types/api.dto";
import { formatCurrency } from "@/lib/utils";

type RowData = FixedRateAnnualSummaryRow;

export const annualSummaryColumns: ColumnDef<RowData>[] = [
  {
    accessorKey: "year",
    header: "Año",
  },
  {
    accessorKey: "annual_payments",
    header: "Pagos Anuales",
    cell: ({ row }) => formatCurrency(row.getValue("annual_payments")),
  },
  {
    accessorKey: "annual_interest",
    header: "Interés Anual",
    cell: ({ row }) => formatCurrency(row.getValue("annual_interest")),
  },
  {
    accessorKey: "annual_principal",
    header: "Capital Anual",
    cell: ({ row }) => formatCurrency(row.getValue("annual_principal")),
  },
  {
    accessorKey: "annual_balance",
    header: "Saldo Final Año",
    cell: ({ row }) => formatCurrency(row.getValue("annual_balance")),
  },
];
