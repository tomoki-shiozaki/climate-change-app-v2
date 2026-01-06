"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/features/auth/context/useAuthContext";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { currentUsername } = useAuthContext();
  const router = useRouter();

  // 未認証 → ログインページにリダイレクト
  useEffect(() => {
    if (!currentUsername) {
      router.replace("/login");
    }
  }, [currentUsername, router]);

  // リダイレクト中は何も描画しない
  if (!currentUsername) {
    return null;
  }

  // 認証済み → 子ページを表示
  return <>{children}</>;
}
