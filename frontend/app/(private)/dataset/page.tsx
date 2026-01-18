"use client";

import { useState } from "react";
import { apiClient } from "@/features/auth/api/apiClient";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";

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
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />

      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? "アップロード中..." : "アップロード"}
      </Button>

      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </PageLayout>
  );
}
