"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/features/auth/context";
import { useErrorContext } from "@/context/error";
import { apiClient } from "@/features/auth/api/apiClient";
import { AppLayout } from "@/app/components/AppLayout";
import { FullScreenLoading } from "@/components/common";
import { logInfo, logWarn } from "@/lib/logger";

export function AppContent({ children }: { children: React.ReactNode }) {
  const { authLoading } = useAuthContext();
  const { clearError } = useErrorContext();
  const pathname = usePathname();

  // ページ遷移ごとにエラーをクリア
  useEffect(() => {
    clearError();
  }, [pathname, clearError]);

  // バックエンドウォームアップ
  useEffect(() => {
    apiClient
      .get("/health/ping")
      .then(() => logInfo("Backend wake-up success"))
      .catch((err) => logWarn("Backend wake-up failed", err));
  }, []);

  if (authLoading) return <FullScreenLoading message="読み込み中..." />;

  return <AppLayout>{children}</AppLayout>; // Next.js のページコンポーネントがここに入る
}
