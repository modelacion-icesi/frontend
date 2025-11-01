// src/features/mixed-rate-amortization/components/MixedRateAmortizationForm.tsx
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  PERIOD_TYPES,
  RATE_TYPES,
  PERIOD_TYPE_LABELS,
  RATE_TYPE_LABELS,
} from "@/constants/finance.constants";
import type { MixedRateAmortizationInput, Rate } from "@/types/api.dto";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

// --- 1. NUEVO HELPER ---
// Helper para obtener el último día del mes de una fecha dada
// (Usamos la zona horaria local para evitar saltos de día)
const getLastDayOfMonth = (date: Date): Date => {
  // Crea una fecha para el 1er día del *siguiente* mes
  const firstDayOfNextMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    1
  );
  // Resta 1 día (en ms) para obtener el último día del mes *actual*
  return new Date(firstDayOfNextMonth.getTime() - 86400000); // 1 día en ms
};

// Definimos el tipo del formulario
type FormValues = Omit<
  MixedRateAmortizationInput,
  "start_date" | "n_term_in_years" | "credit_amount" | "rate"
> & {
  start_date: Date;
  n_term_in_years: number | string;
  credit_amount: number | string;
  rate: Omit<Rate, "value"> & {
    value: number | string;
  };
};

interface Props {
  onSubmit: (data: MixedRateAmortizationInput) => void;
  isPending: boolean;
}

export const MixedRateAmortizationForm = ({ onSubmit, isPending }: Props) => {
  // 1. Definir el formulario
  const form = useForm<FormValues>({
    defaultValues: {
      // --- 3. ACTUALIZAR VALOR POR DEFECTO ---
      start_date: getLastDayOfMonth(new Date("2024-01-01T05:00:00.000Z")), // e.j. 31 de Enero
      n_term_in_years: 15,
      credit_amount: 150000000,
      rate: {
        value: 12.5,
        type: "NOMINAL_VENCIDA",
        period: "ANUAL",
      },
    },
  });

  // 2. Definir el handler
  const handleSubmit = (values: FormValues) => {
    // Transformamos los datos al DTO esperado
    const requestData: MixedRateAmortizationInput = {
      ...values,
      start_date: format(values.start_date, "yyyy-MM-dd"), // Se envía el último día
      n_term_in_years: Number(values.n_term_in_years),
      credit_amount: Number(values.credit_amount),
      rate: {
        ...values.rate,
        value: Number(values.rate.value),
        period:
          values.rate.type === "EFECTIVA_ANUAL" ? null : values.rate.period,
      },
    };
    onSubmit(requestData);
  };

  // Observamos el tipo de tasa para el objeto 'rate'
  const watchedRateType = form.watch("rate.type");
  const isRatePeriodDisabled = watchedRateType === "EFECTIVA_ANUAL";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* --- Grupo 1: Crédito --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="credit_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto del Crédito</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
                <FormDescription>
                  {formatCurrency(Number(field.value || 0))}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="n_term_in_years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plazo (Años)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription> {field.value} Años</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- 4. CAMPO DE FECHA MODIFICADO --- */}
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio (Mes y Año)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal")}
                      >
                        {field.value ? (
                          // Mostramos solo mes y año
                          format(field.value, "MMMM yyyy", { locale: es })
                        ) : (
                          <span>Selecciona un mes</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      // Quitamos onSelect para que los días no sean clickables

                      // Usamos onMonthChange para actualizar el valor
                      onMonthChange={(monthDate) => {
                        field.onChange(getLastDayOfMonth(monthDate));
                      }}
                      // Controlamos el mes visible
                      month={field.value}
                      // --- SOLUCIÓN DE NAVEGACIÓN DE AÑO ---
                      captionLayout="dropdown-years"
                    />
                  </PopoverContent>
                </Popover>
                {/* <FormDescription>
                  Se seleccionará automáticamente el último día del mes.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* --- Grupo 2: Tasa (Objeto Anidado 'rate') --- */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tasa del Crédito</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
            <FormField
              control={form.control}
              name="rate.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  {/* <FormDescription>Ej: 12.5 para 12.5%</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Tasa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RATE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {RATE_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate.period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodo de la Tasa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "ANUAL"}
                    disabled={isRatePeriodDisabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un periodo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PERIOD_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {PERIOD_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <FormDescription>
                    Ignorado si la tasa es Efectiva Anual.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Calculando..." : "Calcular"}
        </Button>
      </form>
    </Form>
  );
};
