"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchDatasetList } from "@/features/dataset/api/dataset";
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
  const [datasets, setDatasets] = useState<DatasetList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const data = await fetchDatasetList();
        setDatasets(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6 space-y-4">
        <h2 className="text-xl font-semibold text-blue-600">CSV一覧</h2>

        {loading && <p className="text-sm text-gray-500">読み込み中…</p>}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && datasets.length === 0 && (
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
