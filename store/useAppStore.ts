import { create } from 'zustand';

export type TradingMode = 'normal' | 'prediction';

interface AppState {
  // Mode Toggle
  tradingMode: TradingMode;
  setTradingMode: (mode: TradingMode) => void;
  
  // Selected Stock
  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string | null) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Prediction Panel
  isPredictionPanelOpen: boolean;
  setPredictionPanelOpen: (open: boolean) => void;
  selectedTimeframe: string | null;
  setSelectedTimeframe: (timeframe: string | null) => void;
  
  // Watchlist
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Mode Toggle
  tradingMode: 'normal',
  setTradingMode: (mode) => set({ tradingMode: mode }),
  
  // Selected Stock
  selectedSymbol: 'AAPL',
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  
  // Theme
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  // Prediction Panel
  isPredictionPanelOpen: false,
  setPredictionPanelOpen: (open) => set({ isPredictionPanelOpen: open }),
  selectedTimeframe: null,
  setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  
  // Watchlist
  watchlist: ['AAPL', 'GOOGL', 'MSFT', 'TSLA'],
  addToWatchlist: (symbol) => set((state) => ({
    watchlist: [...state.watchlist, symbol]
  })),
  removeFromWatchlist: (symbol) => set((state) => ({
    watchlist: state.watchlist.filter(s => s !== symbol)
  })),
}));