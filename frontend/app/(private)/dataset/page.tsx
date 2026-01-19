"use client";

import { useState } from "react";
import { apiClient } from "@/features/auth/api/apiClient";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function DatasetPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("ファイルを選択してください");
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", file.name);
      formData.append("source_file", file);

      const res = await apiClient.post("/dataset/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(`アップロード成功: ID ${res.data.id}, 名前 ${res.data.name}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`アップロード失敗: ${error.message}`);
      } else {
        setMessage("アップロード失敗: 不明なエラー");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageLayout
      title="データセットアップロード"
      description="CSV ファイルを選択してアップロードしてください"
    >
      <Card className="max-w-xl">
        <CardContent className="space-y-6 pt-6">
          {/* ファイル選択 */}
          <div className="space-y-2">
            <Label htmlFor="dataset-file">CSVファイル</Label>

            <input
              id="dataset-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="
              block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:cursor-not-allowed disabled:opacity-60
            "
              disabled={uploading}
            />

            {file && (
              <p className="text-sm text-muted-foreground">
                選択中: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* アップロードボタン */}
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={uploading || !file}>
              {uploading ? "アップロード中..." : "アップロード"}
            </Button>
          </div>

          {/* メッセージ */}
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
