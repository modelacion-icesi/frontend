// src/features/variable-rate-amortization/components/variableRateAmortizationColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { VariableRateAmortizationRow } from "@/types/api.dto";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type RowData = VariableRateAmortizationRow;

export const variableRateAmortizationColumns: ColumnDef<RowData>[] = [
  {
    accessorKey: "period",
    header: "Período",
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      return format(
        new Date(date.getTime() + userTimezoneOffset),
        "dd/MM/yyyy"
      );
    },
  },
  {
    accessorKey: "current_rate",
    header: "Tasa Periodo",
    cell: ({ row }) => {
      const rate = row.getValue("current_rate") as number;
      const label = row.getValue("rate_label") as string;
      return `${(rate * 100).toFixed(2)}% ${label}`;
    },
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    cell: ({ row }) => formatCurrency(row.getValue("balance")),
  },
  {
    accessorKey: "payment",
    header: "Cuota",
    cell: ({ row }) => formatCurrency(row.getValue("payment")),
  },
  {
    accessorKey: "interest",
    header: "Interés",
    cell: ({ row }) => formatCurrency(row.getValue("interest")),
  },
  {
    accessorKey: "principal",
    header: "Abono a Capital",
    cell: ({ row }) => formatCurrency(row.getValue("principal")),
  },
];
