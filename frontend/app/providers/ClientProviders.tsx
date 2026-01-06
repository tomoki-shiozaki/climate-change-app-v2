"use client";

import { ReactNode, useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/app/lib/queryClient";
import { useErrorContext } from "@/context/error";
import { AuthProvider } from "@/features/auth/context";

export function ClientProviders({ children }: { children: ReactNode }) {
  const { setError } = useErrorContext();
  const queryClient = useMemo(() => createQueryClient(setError), [setError]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
