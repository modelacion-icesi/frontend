// src/features/fixed-rate-amortization/components/FixedRateAmortizationForm.tsx
import { useForm } from "react-hook-form"; // No necesitamos 'Controller' aquí, Shadcn lo usa internamente
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
import type { FixedRateAmortizationRequest } from "@/types/api.dto";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

//
// --- ✨ LA CORRECCIÓN ESTÁ AQUÍ ---
//
// Definimos el tipo del formulario
type FormValues = Omit<
  FixedRateAmortizationRequest,
  "credit_amount" | "duration_years" | "interest_rate" | "start_date" // <-- AÑADIMOS "start_date" AQUÍ
> & {
  credit_amount: number | string;
  duration_years: number | string;
  interest_rate: number | string;
  start_date: Date; // Usamos Date para el DatePicker
};

interface Props {
  onSubmit: (data: FixedRateAmortizationRequest) => void;
  isPending: boolean;
}

export const FixedRateAmortizationForm = ({ onSubmit, isPending }: Props) => {
  // 1. Definir el formulario
  const form = useForm<FormValues>({
    defaultValues: {
      credit_amount: 100000000,
      duration_years: 10,
      start_date: new Date("2024-01-01T05:00:00.000Z"),
      interest_rate: 12,
      rate_type: "NOMINAL_VENCIDA",
      rate_period: "ANUAL",
      payment_period: "MENSUAL",
    },
  });

  // 2. Definir el handler
  const handleSubmit = (values: FormValues) => {
    // Transformamos los datos al DTO esperado por la API
    const requestData: FixedRateAmortizationRequest = {
      ...values,
      credit_amount: Number(values.credit_amount),
      duration_years: Number(values.duration_years),
      interest_rate: Number(values.interest_rate),
      // Formateamos la fecha a YYYY-MM-DD
      start_date: format(values.start_date, "yyyy-MM-dd"),
      rate_period:
        values.rate_type === "EFECTIVA_ANUAL" ? undefined : values.rate_period,
    };
    onSubmit(requestData);
  };

  // Observamos el tipo de tasa para deshabilitar el periodo de tasa
  const watchedRateType = form.watch("rate_type");
  const isRatePeriodDisabled = watchedRateType === "EFECTIVA_ANUAL";

  // Con el tipo 'FormValues' corregido, todos los errores
  // en 'form.control' y 'form.handleSubmit' desaparecerán.
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* --- Grupo 1: Crédito --- */}
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
            name="duration_years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription> {field.value} Años</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      autoFocus
                      captionLayout="dropdown-years"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Grupo 2: Tasa --- */}
          <FormField
            control={form.control}
            name="interest_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tasa de Interés (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
                {/* <FormDescription>Ej: 12 para 12%</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rate_type"
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
            name="rate_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Periodo de la Tasa</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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

                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Grupo 3: Pago --- */}
          <FormField
            control={form.control}
            name="payment_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frecuencia de Pago</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una frecuencia" />
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Calculando..." : "Calcular"}
        </Button>
      </form>
    </Form>
  );
};
