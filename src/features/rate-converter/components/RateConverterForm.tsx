// src/features/rate-converter/components/RateConverterForm.tsx
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
  PERIOD_TYPES,
  RATE_TYPES,
  PERIOD_TYPE_LABELS,
  RATE_TYPE_LABELS,
} from "@/constants/finance.constants";
import type { RateConversionRequest, Rate } from "@/types/api.dto";

// Definimos el tipo del formulario
type FormValues = Omit<RateConversionRequest, "initial_rate"> & {
  initial_rate: Omit<Rate, "value"> & {
    value: number | string;
  };
};

interface Props {
  onSubmit: (data: RateConversionRequest) => void;
  isPending: boolean;
}

export const RateConverterForm = ({ onSubmit, isPending }: Props) => {
  // 1. Definir el formulario
  const form = useForm<FormValues>({
    defaultValues: {
      initial_rate: {
        value: 12,
        type: "NOMINAL_VENCIDA",
        period: "ANUAL",
      },
      target_type: "EFECTIVA_ANUAL",
      target_duration: "ANUAL",
    },
  });

  // 2. Definir el handler
  const handleSubmit = (values: FormValues) => {
    const requestData: RateConversionRequest = {
      ...values,
      initial_rate: {
        ...values.initial_rate,
        value: Number(values.initial_rate.value),
        period:
          values.initial_rate.type === "EFECTIVA_ANUAL"
            ? "ANUAL"
            : values.initial_rate.period,
      },
    };
    onSubmit(requestData);
  };

  // Observamos el tipo de tasa inicial
  const watchedRateType = form.watch("initial_rate.type");
  const isRatePeriodDisabled = watchedRateType === "EFECTIVA_ANUAL";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* --- Tasa Inicial --- */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tasa Inicial</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
            <FormField
              control={form.control}
              name="initial_rate.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa (%)</FormLabel>
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
              name="initial_rate.type"
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
              name="initial_rate.period"
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

        {/* --- Tasa Objetivo --- */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tasa Objetivo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
            <FormField
              control={form.control}
              name="target_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Tasa Objetivo</FormLabel>
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
              name="target_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración/Periodo Objetivo</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Convirtiendo..." : "Convertir Tasa"}
        </Button>
      </form>
    </Form>
  );
};
