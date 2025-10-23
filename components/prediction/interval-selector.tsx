"use client";

import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/I18nContext";
import { INTERVAL_OPTIONS, type PredictionInterval } from "@/types/prediction";

interface IntervalSelectorProps {
  value: PredictionInterval;
  onChange: (interval: PredictionInterval) => void;
  disabled?: boolean;
}

export function IntervalSelector({
  value,
  onChange,
  disabled,
}: IntervalSelectorProps) {
  const { t } = useI18n();

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full bg-[#111111] border-white/10 hover:bg-white/5 hover:border-white/20 text-white">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <SelectValue placeholder={t("prediction.selectStockLabel")} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#111111] border-white/10">
        {INTERVAL_OPTIONS.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-white hover:bg-white/5 cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-gray-400">
                {option.description}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
