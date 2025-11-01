// src/components/layout/RootLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export const RootLayout = () => {
  // 1. El estado ahora vive aquí, en el componente padre.
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      {/* 2. Pasamos el estado y la función para cambiarlo al Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* 3. El contenido principal ahora tiene un 'margin-left' dinámico.
           Esto "empuja" el contenido para dejar espacio al sidebar fijo.
           Ya no usamos flexbox aquí.
      */}
      <main
        className={cn(
          "h-screen overflow-y-auto p-6 lg:p-8 transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-64" // <-- La magia está aquí
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};
