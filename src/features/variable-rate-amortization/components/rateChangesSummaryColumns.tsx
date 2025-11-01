// src/features/variable-rate-amortization/components/rateChangesSummaryColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { VariableRateChangeSummary } from "@/types/api.dto";

type RowData = VariableRateChangeSummary;

export const rateChangesSummaryColumns: ColumnDef<RowData>[] = [
  {
    accessorKey: "start_period",
    header: "Período Inicial",
  },
  {
    accessorKey: "end_period",
    header: "Período Final",
  },
  {
    accessorKey: "periods_count",
    header: "Nro. Períodos",
  },
  {
    accessorKey: "rate_percentage",
    header: "Tasa (%)",
    cell: ({ row }) => `${row.getValue("rate_percentage")}%`,
  },
  {
    accessorKey: "rate_label",
    header: "Tipo Tasa",
  },
];
