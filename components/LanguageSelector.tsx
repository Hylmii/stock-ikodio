"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { languages } from "@/lib/i18n/languages";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useI18n();
  const selectedLanguage =
    languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as any);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{selectedLanguage.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#1a1a1a] border-gray-800 max-h-[400px] overflow-y-auto"
      >
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer hover:bg-white/5 text-gray-300 hover:text-white ${
              lang.code === language ? "bg-white/10" : ""
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            <span className="font-medium">{lang.code}</span>
            <span className="ml-2 text-gray-500">- {lang.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
