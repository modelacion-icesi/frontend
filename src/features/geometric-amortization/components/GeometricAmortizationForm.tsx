// src/features/geometric-amortization/components/GeometricAmortizationForm.tsx
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
import type { GeometricAmortizationRequest } from "@/types/api.dto";
import { formatCurrency } from "@/lib/utils"; // <-- Importar formatCurrency

// Tipo de formulario mejorado
type FormValues = Omit<
  GeometricAmortizationRequest,
  "VP" | "i" | "nper" | "g"
> & {
  VP: number | string;
  i: number | string;
  nper: number | string;
  g: number | string;
};

interface Props {
  onSubmit: (data: GeometricAmortizationRequest) => void;
  isPending: boolean;
}

export const GeometricAmortizationForm = ({ onSubmit, isPending }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      VP: 4218608.74,
      i: 0.04, // 4% mensual
      nper: 20,
      g: 0.05, // 5% gradiente
    },
  });

  const handleSubmit = (values: FormValues) => {
    const numericValues: GeometricAmortizationRequest = {
      VP: Number(values.VP),
      i: Number(values.i),
      nper: Number(values.nper),
      g: Number(values.g),
    };
    onSubmit(numericValues);
  };

  const watchedVP = form.watch("VP");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="VP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Presente (VP)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="1000000"
                    {...field}
                  />
                </FormControl>
                {/* --- CORRECCIÓN DE ALINEACIÓN --- */}
                <div className="min-h-6 flex items-center">
                  <FormDescription>
                    {formatCurrency(Number(watchedVP || 0))}
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="i"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tasa Interés (i)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.02"
                    {...field}
                  />
                </FormControl>
                {/* --- CORRECCIÓN DE ALINEACIÓN --- */}
                <div className="min-h-6 flex items-center">
                  <FormDescription>
                    Tasa mensual vencida (ej: 0.02 para 2%).
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nper"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Períodos (nper)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="24" {...field} />
                </FormControl>
                {/* --- CORRECCIÓN DE ALINEACIÓN --- */}
                <div className="min-h-6 flex items-center">
                  <FormDescription>Número de meses.</FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="g"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gradiente Geométrico (g)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.01"
                    {...field}
                  />
                </FormControl>
                {/* --- CORRECCIÓN DE ALINEACIÓN --- */}
                <div className="min-h-6 flex items-center">
                  <FormDescription>
                    Crecimiento decimal (ej: 0.01 para 1%).
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
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
