"use client";

import { Card, CardContent } from "@/components/ui/card";

export function DatasetList() {
  return (
    <Card className="max-w-xl">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">CSV一覧</h2>
        <p className="text-gray-500 text-sm">
          ここにアップロード済みのCSVファイル一覧が表示されます。
        </p>
      </CardContent>
    </Card>
  );
}
