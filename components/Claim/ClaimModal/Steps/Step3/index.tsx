import React from "react";
import env from "@/constant/env";

import dynamic from "next/dynamic";

const PassPreview = dynamic(() => import("@/components/commons/PassPreview"));
const PassPreviewV2 = dynamic(
  () => import("@/components/commons/PassPreviewV2")
);

export const Step3 = ({ template }: { template?: string }) => {
  return env.PASS_VERSION === "2" ? (
    <PassPreviewV2 />
  ) : (
    <PassPreview template={template} />
  );
};
