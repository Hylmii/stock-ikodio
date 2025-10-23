"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  searchStocksForPrediction,
  getPopularStocks,
} from "@/lib/services/prediction.service";
import type { StockOption } from "@/types/prediction";

interface StockSelectorProps {
  value: string;
  onChange: (stock: StockOption) => void;
  disabled?: boolean;
}

export function StockSelector({
  value,
  onChange,
  disabled,
}: StockSelectorProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState<StockOption[]>([]);
  const [popularStocks, setPopularStocks] = useState<StockOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load popular stocks on mount
  useEffect(() => {
    const loadPopular = async () => {
      const popular = await getPopularStocks();
      setPopularStocks(popular);
      setStocks(popular);
    };
    loadPopular();
  }, []);

  // Search stocks
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setStocks(popularStocks);
      return;
    }

    const searchDebounced = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchStocksForPrediction(searchQuery);
      setStocks(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchDebounced);
  }, [searchQuery, popularStocks]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between bg-[#111111] border-white/10 hover:bg-white/5 hover:border-white/20 text-white"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <span>{value || t("prediction.selectStock")}</span>
          </div>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-[#111111] border-white/10">
        <Command className="bg-[#111111]">
          <CommandInput
            placeholder={t("header.search") + "..."}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-white/10"
          />
          <CommandList>
            <CommandEmpty>
              {isSearching ? t("common.loading") : "No stocks found."}
            </CommandEmpty>
            {stocks.length > 0 && (
              <CommandGroup
                heading={searchQuery ? "Search Results" : "Popular Stocks"}
              >
                {/* Remove duplicates based on symbol */}
                {Array.from(
                  new Map(stocks.map(stock => [stock.symbol, stock])).values()
                ).map(stock => (
                  <CommandItem
                    key={stock.symbol}
                    value={stock.symbol}
                    onSelect={() => {
                      onChange(stock);
                      setOpen(false);
                    }}
                    className="hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">
                          {stock.displaySymbol || stock.symbol}
                        </span>
                        <span className="text-xs text-gray-500">
                          {stock.type}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 truncate">
                        {stock.description}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
