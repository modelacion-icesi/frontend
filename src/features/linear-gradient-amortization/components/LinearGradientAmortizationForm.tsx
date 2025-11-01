// src/features/linear-gradient-amortization/components/LinearGradientAmortizationForm.tsx
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
import type { LinearGradientInput } from "@/types/api.dto";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

// Definimos el tipo del formulario
type FormValues = Omit<
  LinearGradientInput,
  | "credit_present_value"
  | "duration_years"
  | "start_date"
  | "gradient"
  | "base_payment"
  | "interest_rate"
> & {
  credit_present_value: number | string;
  duration_years: number | string;
  start_date: Date;
  gradient: number | string;
  base_payment: number | string;
  interest_rate: number | string;
};

interface Props {
  onSubmit: (data: LinearGradientInput) => void;
  isPending: boolean;
}

export const LinearGradientAmortizationForm = ({
  onSubmit,
  isPending,
}: Props) => {
  // 1. Definir el formulario
  const form = useForm<FormValues>({
    defaultValues: {
      credit_present_value: 130000000,
      duration_years: 10,
      start_date: new Date("2020-01-01T05:00:00.000Z"),
      gradient: 50000,
      base_payment: 1000000,
      interest_rate: 19,
      rate_type: "NOMINAL_VENCIDA",
      rate_period: "ANUAL",
      gradient_period: "MENSUAL",
    },
  });

  // 2. Definir el handler
  const handleSubmit = (values: FormValues) => {
    // Transformamos los datos al DTO esperado
    const requestData: LinearGradientInput = {
      ...values,
      credit_present_value: Number(values.credit_present_value),
      duration_years: Number(values.duration_years),
      start_date: format(values.start_date, "yyyy-MM-dd"),
      gradient: Number(values.gradient),
      base_payment: Number(values.base_payment),
      interest_rate: Number(values.interest_rate),
      rate_period:
        values.rate_type === "EFECTIVA_ANUAL" ? null : values.rate_period,
    };
    onSubmit(requestData);
  };

  // Observamos el tipo de tasa
  const watchedRateType = form.watch("rate_type");
  const isRatePeriodDisabled = watchedRateType === "EFECTIVA_ANUAL";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* --- Grupo 1: Crédito --- */}
          <FormField
            control={form.control}
            name="credit_present_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Presente (VP)</FormLabel>
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
                <FormLabel>Duración (Años)</FormLabel>
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
                        className={cn("w-full pl-3 text-left font-normal")}
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

          {/* --- Grupo 2: Pago y Gradiente --- */}
          <FormField
            control={form.control}
            name="base_payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuota Base</FormLabel>
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
            name="gradient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gradiente Lineal (G)</FormLabel>
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
            name="gradient_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Periodo Gradiente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                <FormDescription>
                  Selecciona periodo de gradiente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Grupo 3: Tasa --- */}
          <FormField
            control={form.control}
            name="interest_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tasa de Interés (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
                {/* <FormDescription>Ej: 19 para 19%</FormDescription> */}
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
