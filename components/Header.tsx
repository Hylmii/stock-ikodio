"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, LogOut, User as UserIcon } from "lucide-react";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import LanguageSelector from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n/I18nContext";
import { LiveClock } from "@/components/live-clock";

const Header = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const { t, language } = useI18n();
  const [, forceUpdate] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    StockWithWatchlistStatus[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  // Re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => forceUpdate({});
    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  // Search stocks with real-time data from Finnhub
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    console.log("Client: Starting search for:", query);
    try {
      const results = await searchStocks(query);
      console.log("Client: Got results:", results.length);
      setSearchResults(results);
    } catch (error) {
      console.error("Client: Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Import signOut dynamically to avoid client-side errors
      const { signOut } = await import("@/lib/better-auth/client");
      await signOut();

      // Clear any remaining localStorage
      localStorage.removeItem("ikodio_auth");
      localStorage.removeItem("ikodio_email");
      localStorage.removeItem("ikodio_kyc_completed");
      localStorage.removeItem("ikodio_has_visited");

      // Redirect to home
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: just redirect
      window.location.href = "/";
    }
  };

  const handleProfile = () => {
    // Navigate to profile page or open profile modal
    router.push("/dashboard/profile");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0A0A0A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/80">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl font-medium text-white tracking-tight">
              Ikodio
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {t("header.dashboard")}
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t("header.search")}
            </button>
            <Link
              href="/prediction"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {t("header.prediction")}
            </Link>
          </nav>

          {/* Right Side - Search & User */}
          <div className="flex items-center gap-4">
            {/* Live Clock */}
            <LiveClock className="hidden md:flex" />

            {/* Quick Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Dropdown */}
            {user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <Avatar className="h-10 w-10 border-2 border-purple-500/50 hover:border-purple-500">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-[#111111] border border-white/10 p-2 z-[9999] shadow-2xl"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="font-normal p-3 bg-[#0A0A0A]/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-purple-500/50">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10 my-2" />
                  <DropdownMenuItem
                    onClick={handleProfile}
                    className="cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded-md p-2.5 text-gray-100"
                  >
                    <UserIcon className="mr-2 h-4 w-4 text-purple-400" />
                    <span>{t("header.profile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 rounded-md p-2.5 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("header.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {t("header.signIn")}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#111111] border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Search Stocks
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by symbol or company name..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10 bg-[#0A0A0A] border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                autoFocus
              />
            </div>

            {/* Search Results */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((stock, index) => (
                  <button
                    key={`${stock.symbol}-${stock.exchange}-${index}`}
                    onClick={() => {
                      router.push(`/stocks/${stock.symbol}`);
                      setSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5 hover:border-purple-500/50"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-white">
                        {stock.symbol}
                      </span>
                      <span className="text-sm text-gray-400">
                        {stock.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{stock.exchange}</span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                        {stock.type}
                      </span>
                    </div>
                  </button>
                ))
              ) : searchQuery.trim().length >= 2 ? (
                <div className="text-center py-8 text-gray-400">
                  No stocks found
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Type at least 2 characters to search
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
