// src/providers/AppProviders.tsx
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Crear una instancia de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false, // Opcional: deshabilitar refetch en focus
    },
  },
});

interface Props {
  children: ReactNode;
}

export const AppProviders = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Aquí irían otros providers (Theme, Auth, etc.) */}
    </QueryClientProvider>
  );
};
