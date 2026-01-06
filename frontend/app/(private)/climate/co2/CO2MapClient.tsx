"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  CO2MapExplanation,
  CO2DataSource,
} from "@/features/climate/components";

const CO2WorldMap = dynamic(
  () =>
    import("@/features/climate/components/CO2WorldMap").then(
      (mod) => mod.CO2WorldMap
    ),
  { ssr: false }
);

export function CO2MapClient() {
  return (
    <>
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
    </>
  );
}
