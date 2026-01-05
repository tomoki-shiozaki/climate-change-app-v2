import { PageLayout } from "@/components/layout/PageLayout";
import { CO2MapClient } from "./CO2MapClient";

export default function CO2MapPage() {
  return (
    <PageLayout
      title="世界のCO₂排出量マップ"
      description="各国のCO₂排出量（年間総量）を地図上で可視化し、国ごとの違いを確認できます。"
    >
      <CO2MapClient />
    </PageLayout>
  );
}
