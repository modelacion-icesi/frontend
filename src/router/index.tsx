// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import GeometricAmortizationPage from "@/pages/GeometricAmortizationPage";
import FixedRateAmortizationPage from "@/pages/FixedRateAmortizationPage";
import VariableRateAmortizationPage from "@/pages/VariableRateAmortizationPage";
import LinearGradientAmortizationPage from "@/pages/LinearGradientAmortizationPage";
import MixedRateAmortizationPage from "@/pages/MixedRateAmortizationPage";
import RateConverterPage from "@/pages/RateConverterPage";
import { RootLayout } from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // Ruta raíz (/)
        element: <HomePage />,
      },
      {
        path: "amortization/geometric",
        element: <GeometricAmortizationPage />,
      },
      {
        path: "amortization/fixed-rate",
        element: <FixedRateAmortizationPage />,
      },
      {
        path: "amortization/variable-rate",
        element: <VariableRateAmortizationPage />,
      },
      {
        path: "amortization/linear-gradient",
        element: <LinearGradientAmortizationPage />,
      },
      {
        path: "amortization/mixed-rate",
        element: <MixedRateAmortizationPage />,
      },
      {
        path: "rates/convert",
        element: <RateConverterPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
