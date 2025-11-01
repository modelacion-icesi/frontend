// src/features/geometric-amortization/components/geometricAmortizationColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { GeometricAmortizationRow } from "@/services/amortization.service";

// Función helper para formatear a moneda (la crearemos en lib/utils.ts)
import { formatCurrency } from "@/lib/utils";

// El tipo de dato es la fila LIMPIA que definimos en el servicio
type RowData = GeometricAmortizationRow;

export const geometricAmortizationColumns: ColumnDef<RowData>[] = [
  {
    accessorKey: "period",
    header: "Período",
  },
  {
    accessorKey: "initialBalance",
    header: "Saldo Inicial",
    cell: ({ row }) => formatCurrency(row.getValue("initialBalance")),
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
  {
    accessorKey: "finalBalance",
    header: "Saldo Final",
    cell: ({ row }) => formatCurrency(row.getValue("finalBalance")),
  },
];
