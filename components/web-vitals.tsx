"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackWebVitals } from "@/utils/performance";

export function WebVitals() {
  useReportWebVitals(metric => {
    trackWebVitals(metric);
  });

  return null;
}
