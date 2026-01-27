"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDatasetList } from "@/features/dataset/api/fetchDatasetList";
import type { DatasetStatus } from "@/features/dataset/types/dataset";
import Link from "next/link";

const STATUS_LABEL: Record<DatasetStatus, string> = {
  uploaded: "アップロード済み",
  processing: "処理中",
  parsed: "解析完了",
  failed: "失敗",
};

const STATUS_VARIANT: Record<
  DatasetStatus,
  "default" | "secondary" | "destructive"
> = {
  parsed: "default",
  processing: "secondary",
  uploaded: "secondary",
  failed: "destructive",
};

export function DatasetList() {
  const limit = 10;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["datasets"],

    initialPageParam: 0,

    queryFn: ({ pageParam }) => fetchDatasetList({ limit, offset: pageParam }),

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * limit;
    },

    // processing がある間だけポーリング
    refetchInterval: (query) =>
      query.state.data?.pages.some((page) =>
        page.results.some((ds) => ds.status === "processing"),
      )
        ? 3000
        : false,
  });

  const datasets = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6 space-y-4">
        <h2 className="text-xl font-semibold text-blue-600">CSV一覧</h2>

        {isLoading && <Loading message="CSV一覧を読み込み中..." />}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>CSV一覧の取得に失敗しました</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {!isLoading && datasets.length === 0 && (
          <p className="text-sm text-gray-500">
            まだCSVがアップロードされていません。
          </p>
        )}

        <ul className="space-y-2">
          {datasets.map((ds) => {
            const clickable = ds.status === "parsed";

            return (
              <li
                key={ds.id}
                className={`border rounded-lg p-3 flex items-center justify-between transition
                  ${clickable ? "hover:bg-gray-50" : "opacity-60"}
                `}
              >
                <div>
                  {clickable ? (
                    <Link
                      href={`/datasets/${ds.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {ds.name}
                    </Link>
                  ) : (
                    <p className="font-medium">{ds.name}</p>
                  )}

                  <p className="text-xs text-gray-500">
                    {new Date(ds.created_at).toLocaleString()}
                  </p>
                </div>

                <Badge variant={STATUS_VARIANT[ds.status]}>
                  {STATUS_LABEL[ds.status]}
                </Badge>
              </li>
            );
          })}
        </ul>

        {hasNextPage && (
          <Button
            className="mt-2"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "読み込み中…" : "もっと見る"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
