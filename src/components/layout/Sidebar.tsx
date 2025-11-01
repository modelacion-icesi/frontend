// src/components/layout/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import MoneyIcon from "@/assets/money-svgrepo-com.svg?react";
import {
  Home,
  Calculator,
  LineChart,
  AreaChart,
  BarChart3,
  PieChart,
  RefreshCw,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  {
    to: "/amortization/geometric",
    label: "Geométrica",
    icon: LineChart,
  },
  { to: "/amortization/fixed-rate", label: "Tasa Fija", icon: Calculator },
  {
    to: "/amortization/variable-rate",
    label: "Tasa Variable",
    icon: BarChart3,
  },
  {
    to: "/amortization/linear-gradient",
    label: "Gradiente Lineal",
    icon: AreaChart,
  },
  {
    to: "/amortization/mixed-rate",
    label: "Tasa Mixta",
    icon: PieChart,
  },
  { to: "/rates/convert", label: "Conversor de Tasas", icon: RefreshCw },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-20 border-r bg-muted/40 p-4 flex flex-col transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/*
          --- ✨ AQUÍ ESTÁ LA CORRECCIÓN ✨ ---
          Añadimos 'overflow-x-hidden' para asegurarnos de que el contenido
          que se oculta (como el texto) no genere un scroll horizontal.
        */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* 1. Logo y Título */}
          <div
            className={cn(
              "flex items-center gap-2 px-2 mb-4",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <MoneyIcon className="h-8 w-8 text-primary shrink-0" />
            <h1
              className={cn(
                "text-xl font-bold transition-opacity duration-200",
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              )}
            >
              Amortix
            </h1>
          </div>

          {/* 2. Navegación */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) =>
              isCollapsed ? (
                // Versión colapsada (Tooltip)
                <Tooltip key={link.to}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={link.to}
                      end
                      className={({ isActive }) =>
                        cn(
                          "w-full",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/50"
                        )
                      }
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-center gap-2",
                          "font-bold"
                        )}
                      >
                        <link.icon className="h-4 w-4" />
                      </Button>
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                // Versión expandida (Normal)
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "w-full",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50"
                    )
                  }
                >
                  {({ isActive }) => (
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2",
                        isActive && "font-bold"
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  )}
                </NavLink>
              )
            )}
          </nav>
        </div>

        {/* Botón de Colapso */}
        <div className="mt-4">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <div
              className={cn(
                "flex items-center gap-2",
                isCollapsed ? "justify-center" : "justify-start px-2"
              )}
            >
              {isCollapsed ? (
                <PanelRightClose className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
              {/* Mostramos el texto solo si está expandido */}
              <span className={cn(isCollapsed ? "hidden" : "inline")}>
                Colapsar
              </span>
            </div>
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
};
