// src/features/variable-rate-amortization/components/VariableRateAmortizationForm.tsx
import { useForm, useFieldArray } from "react-hook-form";
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
import type {
  VariableRateAmortizationRequest,
  RatePeriod,
} from "@/types/api.dto";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";

// Definimos el tipo del formulario
type FormValues = Omit<
  VariableRateAmortizationRequest,
  "credit_amount" | "duration_years" | "start_date" | "rate_changes"
> & {
  credit_amount: number | string;
  duration_years: number | string;
  start_date: Date;
  // rate_changes será manejado por useFieldArray
  rate_changes: (Omit<RatePeriod, "interest_rate" | "start_period"> & {
    interest_rate: number | string;
    start_period: number | string;
  })[];
};

interface Props {
  onSubmit: (data: VariableRateAmortizationRequest) => void;
  isPending: boolean;
}

export const VariableRateAmortizationForm = ({
  onSubmit,
  isPending,
}: Props) => {
  // 1. Definir el formulario
  const form = useForm<FormValues>({
    defaultValues: {
      credit_amount: 100000000,
      duration_years: 10,
      start_date: new Date("2024-01-01T05:00:00.000Z"),
      payment_period: "MENSUAL",
      rate_changes: [
        {
          start_period: 1,
          interest_rate: 12,
          rate_type: "NOMINAL_VENCIDA",
          rate_period: "ANUAL",
        },
      ],
    },
  });

  // 2. Configurar useFieldArray
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rate_changes",
  });

  // 3. Definir el handler
  const handleSubmit = (values: FormValues) => {
    // Transformamos los datos al DTO esperado
    const requestData: VariableRateAmortizationRequest = {
      ...values,
      credit_amount: Number(values.credit_amount),
      duration_years: Number(values.duration_years),
      start_date: format(values.start_date, "yyyy-MM-dd"),
      rate_changes: values.rate_changes.map((change) => ({
        ...change,
        start_period: Number(change.start_period),
        interest_rate: Number(change.interest_rate),
        rate_period:
          change.rate_type === "EFECTIVA_ANUAL"
            ? undefined
            : change.rate_period,
      })),
    };
    onSubmit(requestData);
  };

  const addNewRateChange = () => {
    append({
      start_period: 1,
      interest_rate: 0,
      rate_type: "NOMINAL_VENCIDA",
      rate_period: "ANUAL",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* --- Campos Principales --- */}
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
            name="duration_years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (Años)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
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
          <FormField
            control={form.control}
            name="payment_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frecuencia de Pago</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "MENSUAL"}
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

        {/* --- Campos Dinámicos (Rate Changes) --- */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Cambios de Tasa</h3>
          {fields.map((field, index) => {
            // Observamos el tipo de tasa para este item específico
            const watchedRateType = form.watch(
              `rate_changes.${index}.rate_type`
            );
            const isRatePeriodDisabled = watchedRateType === "EFECTIVA_ANUAL";

            return (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 rounded-md"
              >
                <FormField
                  control={form.control}
                  name={`rate_changes.${index}.start_period`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período Inicio</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`rate_changes.${index}.interest_rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tasa (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`rate_changes.${index}.rate_type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Tasa</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
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
                  name={`rate_changes.${index}.rate_period`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Periodo Tasa</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "ANUAL"}
                        disabled={isRatePeriodDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
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
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  className="mt-8"
                  disabled={fields.length <= 1} // No permitir borrar el último
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          <Button type="button" variant="outline" onClick={addNewRateChange}>
            Añadir Cambio de Tasa
          </Button>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Calculando..." : "Calcular"}
        </Button>
      </form>
    </Form>
  );
};
