import type { paths } from "@/types/api";

export type DatasetUploadResponse =
  paths["/api/v1/dataset/upload/"]["post"]["responses"][201]["content"]["application/json"];
