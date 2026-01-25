import { apiClient } from "@/features/auth/api/apiClient";
import type { DatasetList } from "@/features/dataset/types/dataset";

export async function fetchDatasetList(): Promise<DatasetList> {
  const { data } = await apiClient.get<DatasetList>("/dataset/list/");
  return data;
}
