"use client";

import { useState } from "react";
import { apiClient } from "@/features/auth/api/apiClient";

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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">データセットアップロード</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "アップロード中..." : "アップロード"}
      </button>

      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
}
