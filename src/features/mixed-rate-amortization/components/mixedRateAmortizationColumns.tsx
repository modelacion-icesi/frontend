// src/features/mixed-rate-amortization/components/mixedRateAmortizationColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { MixedRateAmortizationRow, Rate } from "@/types/api.dto";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type RowData = MixedRateAmortizationRow;

// Helper para renderizar la tasa (que es un objeto)
const renderRate = (rate: Rate) => {
  const value = (rate.value * 100).toFixed(2);
  const periodLabel = rate.period ? ` ${rate.period}` : "";
  return `${value}% ${rate.type}${periodLabel}`;
};

export const mixedRateAmortizationColumns: ColumnDef<RowData>[] = [
  {
    accessorKey: "month",
    header: "Mes",
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
    accessorKey: "fixed_payment",
    header: "Cuota Fija",
    cell: ({ row }) => formatCurrency(row.getValue("fixed_payment")),
  },
  {
    accessorKey: "interest_payment",
    header: "Pago Interés",
    cell: ({ row }) => formatCurrency(row.getValue("interest_payment")),
  },
  {
    accessorKey: "capital_payment",
    header: "Pago Capital",
    cell: ({ row }) => formatCurrency(row.getValue("capital_payment")),
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    cell: ({ row }) => formatCurrency(row.getValue("balance")),
  },
  {
    accessorKey: "inflation_monthly",
    header: "Inflación Mensual",
    cell: ({ row }) => renderRate(row.getValue("inflation_monthly")),
  },
  {
    accessorKey: "global_rate_monthly",
    header: "Tasa Global Mensual",
    cell: ({ row }) => renderRate(row.getValue("global_rate_monthly")),
  },
  {
    accessorKey: "remaining_payment_number",
    header: "Pagos Restantes",
  },
];
