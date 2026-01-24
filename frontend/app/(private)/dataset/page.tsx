import { PageLayout } from "@/components/layout";
import { DatasetUploadForm } from "@/features/dataset/components/DatasetUploadForm";
import { DatasetList } from "@/features/dataset/components/DatasetList";

export default function DatasetPage() {
  return (
    <PageLayout
      title="データセット管理"
      description="CSVのアップロードと一覧表示"
    >
      <div className="space-y-6">
        <DatasetUploadForm />
        <DatasetList />
      </div>
    </PageLayout>
  );
}
