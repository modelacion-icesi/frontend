// src/features/linear-gradient-amortization/components/linearGradientAmortizationColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { LinearGradientAmortizationRow } from "@/types/api.dto";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type RowData = LinearGradientAmortizationRow;

export const linearGradientAmortizationColumns: ColumnDef<RowData>[] = [
  {
    accessorKey: "period_label",
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
    accessorKey: "year",
    header: "Año",
  },
  {
    accessorKey: "gradient_series",
    header: "Serie Gradiente",
    cell: ({ row }) => {
      const value = row.getValue("gradient_series");
      // La API devuelve un string o un número
      if (typeof value === "number") {
        return formatCurrency(value);
      }
      return value; // "Valor del crédito VP"
    },
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    cell: ({ row }) => {
      const value = row.getValue("balance") as number | undefined;
      return value !== undefined ? formatCurrency(value) : "N/A";
    },
  },
];
