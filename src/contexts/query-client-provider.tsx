"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

// Type guard para errores que incluyen un campo HTTP status
function hasStatus(error: unknown): error is { status: number } {
  if (typeof error !== 'object' || error === null) return false;
  const asRecord = error as Record<string, unknown>;
  return typeof asRecord.status === 'number';
}

export function QueryClientProviderWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configuración por defecto para queries
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
            retry: (failureCount: number, error: unknown) => {
              // No reintentar en errores 4xx (errores del cliente)
              if (hasStatus(error) && error.status >= 400 && error.status < 500) {
                return false;
              }
              // Reintentar hasta 3 veces para otros errores
              return failureCount < 3;
            },
            refetchOnWindowFocus: false, // No refrescar automáticamente al enfocar ventana
            refetchOnMount: true, // Refrescar al montar componente
            refetchOnReconnect: true, // Refrescar al reconectar
          },
          mutations: {
            // Configuración por defecto para mutaciones
            retry: () => {
              // No reintentar mutaciones automáticamente
              return false;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Solo mostrar devtools en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
        />
      )}
    </QueryClientProvider>
  );
} 