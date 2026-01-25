"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchDatasetList } from "@/features/dataset/api/fetchDatasetList";
import type {
  DatasetList,
  DatasetStatus,
} from "@/features/dataset/types/dataset";

const STATUS_LABEL: Record<DatasetStatus, string> = {
  uploaded: "アップロード済み",
  processing: "処理中",
  parsed: "解析完了",
  failed: "失敗",
};

export function DatasetList() {
  const {
    data: datasets = [],
    isLoading,
    error,
  } = useQuery<DatasetList>({
    queryKey: ["datasets"],
    queryFn: fetchDatasetList,

    // processing が存在する間だけ 3 秒ポーリング
    refetchInterval: (query) =>
      query.state.data?.some((ds) => ds.status === "processing") ? 3000 : false,
  });

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6 space-y-4">
        <h2 className="text-xl font-semibold text-blue-600">CSV一覧</h2>

        {isLoading && <p className="text-sm text-gray-500">読み込み中…</p>}

        {error && (
          <p className="text-sm text-red-500">{(error as Error).message}</p>
        )}

        {!isLoading && datasets.length === 0 && (
          <p className="text-sm text-gray-500">
            まだCSVがアップロードされていません。
          </p>
        )}

        <ul className="space-y-2">
          {datasets.map((ds) => (
            <li
              key={ds.id}
              className="border rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{ds.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(ds.created_at).toLocaleString()}
                </p>
              </div>

              <span
                className={`text-sm px-2 py-1 rounded
                  ${ds.status === "parsed" && "bg-green-100 text-green-700"}
                  ${ds.status === "processing" && "bg-yellow-100 text-yellow-700"}
                  ${ds.status === "uploaded" && "bg-gray-100 text-gray-700"}
                  ${ds.status === "failed" && "bg-red-100 text-red-700"}
                `}
              >
                {STATUS_LABEL[ds.status]}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
