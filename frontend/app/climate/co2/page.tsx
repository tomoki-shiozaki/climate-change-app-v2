import dynamic from "next/dynamic";

import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  CO2MapExplanation,
  CO2DataSource,
} from "@/features/climate/components";

// 👇 ここが最大の変更点
const CO2WorldMap = dynamic(
  () =>
    import("@/features/climate/components/CO2WorldMap").then(
      (mod) => mod.CO2WorldMap
    ),
  { ssr: false }
);

const CO2MapPage = () => {
  return (
    <PageLayout
      title="世界のCO₂排出量マップ"
      description="各国のCO₂排出量（年間総量）を地図上で可視化し、国ごとの違いを確認できます。"
    >
      {/* マップ本体 */}
      <Card>
        <CardContent>
          <CO2WorldMap />
        </CardContent>

        {/* データ出典 */}
        <CardFooter>
          <CO2DataSource />
        </CardFooter>
      </Card>

      {/* 説明カード */}
      <Card>
        <CardContent>
          <CO2MapExplanation />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default CO2MapPage;
