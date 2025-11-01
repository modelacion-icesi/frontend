// src/features/fixed-rate-amortization/components/fixedRateAmortizationColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { FixedRateAmortizationRow } from "@/types/api.dto";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type RowData = FixedRateAmortizationRow;

export const fixedRateAmortizationColumns: ColumnDef<RowData>[] = [
  {
    accessorKey: "period",
    header: "Período",
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      // API devuelve YYYY-MM-DD. Date lo interpreta como UTC.
      // Para evitar el "off-by-one" (que muestre el día anterior),
      // leemos la fecha y le sumamos el offset de la zona horaria.
      const date = new Date(row.getValue("date"));
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      return format(
        new Date(date.getTime() + userTimezoneOffset),
        "dd/MM/yyyy"
      );
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
