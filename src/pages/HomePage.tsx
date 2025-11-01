// src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calculator,
  LineChart,
  AreaChart,
  BarChart3,
  PieChart,
  RefreshCw,
  List,
} from "lucide-react";

// 1. Definimos nuestras funcionalidades
const features = [
  {
    title: "Amortización Geométrica",
    description: "Calcula una tabla de amortización con cuota creciente.",
    icon: LineChart,
    path: "/amortization/geometric",
  },
  {
    title: "Amortización Tasa Fija",
    description: "Calcula la amortización más común con cuota fija.",
    icon: Calculator,
    path: "/amortization/fixed-rate",
  },
  {
    title: "Amortización Tasa Variable",
    description: "Calcula la amortización con cambios de tasa en el tiempo.",
    icon: BarChart3,
    path: "/amortization/variable-rate",
  },
  {
    title: "Amortización Gradiente Lineal",
    description:
      "Calcula una tabla de amortización con cuota base y gradiente.",
    icon: AreaChart,
    path: "/amortization/linear-gradient",
  },
  {
    title: "Amortización Tasa Mixta",
    description: "Genera una tabla de amortización con tasa mixta.",
    icon: PieChart,
    path: "/amortization/mixed-rate",
  },
  {
    title: "Conversor de Tasas",
    description: "Convierte tasas de interés entre diferentes tipos.",
    icon: RefreshCw,
    path: "/rates/convert",
  },
];

const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* --- Cabecera --- */}
      <div>
        <h1 className="text-3xl font-bold">
          Bienvenido a la Calculadora Financiera
        </h1>
        <p className="text-lg text-muted-foreground">
          Tu set de herramientas para cálculos de amortización y tasas de
          interés.
        </p>
      </div>

      {/* --- Grid de Funcionalidades --- */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Calculadoras Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link to={feature.path} key={feature.path}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200 hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* --- Tips de Uso --- */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tips de Uso</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                Las tasas de interés (ej. 12%) deben ingresarse como{" "}
                <strong>12</strong>, no como 0.12.
              </li>
              <li>
                Al seleccionar una tasa <strong>Efectiva Anual</strong>, el
                campo "Periodo de Tasa" se deshabilitará, ya que no es
                necesario.
              </li>
              <li>
                Las fechas deben ingresarse en formato{" "}
                <strong>YYYY-MM-DD</strong> o seleccionarse usando el
                calendario.
              </li>
              <li>
                En <strong>Tasa Variable</strong>, debes agregar al menos un
                cambio de tasa (el inicial).
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
