import { LanguageCode } from "./languages";

export const translations: Record<LanguageCode, Record<string, string>> = {
  EN: {
    // Header
    "header.dashboard": "Dashboard",
    "header.search": "Search",
    "header.prediction": "Prediction",
    "header.profile": "Profile",
    "header.logout": "Logout",
    "header.signIn": "Sign In",
    "header.getStarted": "Get Started",

    // Hero Section
    "hero.tagline1": "The",
    "hero.tagline2": "fastest way",
    "hero.tagline3": "to",
    "hero.tagline4": "trade",
    "hero.tagline5": "stocks with your",
    "hero.tagline6": "portfolio",
    "hero.subtitle":
      "Generate trading insights quickly and easily using AI, all without leaving Ikodio",
    "hero.getStarted": "Get Started",
    "hero.learnMore": "Learn More",
    "hero.watchDemo": "Watch Demo",

    // Landing Page
    "landing.title": "Welcome to Ikodio",
    "landing.subtitle": "AI-Powered Trading Platform",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.marketOverview": "Market Overview",
    "dashboard.stockHeatmap": "Stock Heatmap",
    "dashboard.topStories": "Top Stories",
    "dashboard.marketData": "Market Data",
    "dashboard.timeline": "Timeline",
    "dashboard.backToDashboard": "Back to Dashboard",

    // Prediction Page
    "prediction.title": "Stock Prediction",
    "prediction.subtitle":
      "AI-powered stock price predictions with advanced time series analysis",
    "prediction.subtitleIntraday":
      "AI-powered intraday predictions for day traders",
    "prediction.disclaimer": "Disclaimer:",
    "prediction.disclaimerText":
      "These predictions are for educational purposes only. They do not guarantee investment results. Always do your own research and consult with financial advisors before making investment decisions.",
    "prediction.selectStock": "Select Stock",
    "prediction.selectStockLabel": "Select Stock",
    "prediction.timeInterval": "Time Interval",
    "prediction.predictionInterval": "Prediction Interval",
    "prediction.generatePrediction": "Generate Prediction",
    "prediction.generating": "Generating...",
    "prediction.analyzing":
      "Analyzing market data and generating predictions...",
    "prediction.priceChart": "Price Chart & Predictions",
    "prediction.chartInfo":
      "Chart shows historical prices (candlesticks) and predicted prices (purple line) with confidence bands (green/red shaded areas)",
    "prediction.metricsAndSignal": "Prediction Metrics & Signal",
    "prediction.modelInfo": "Model Information",
    "prediction.model": "Model",
    "prediction.interval": "Interval",
    "prediction.predictionTime": "Prediction Time",
    "prediction.readyToPredict": "Ready to Predict",
    "prediction.readyDescription":
      'Select a stock and prediction interval above, then click "Generate Prediction" to see AI-powered price forecasts with detailed metrics.',
    "prediction.dailyPrediction": "Daily prediction",
    "prediction.errorSelectStock": "Please select a stock first",
    "prediction.errorFailed": "Failed to generate prediction",
    "prediction.predictionFailed": "Prediction failed",

    // Metrics
    "metrics.mae": "MAE",
    "metrics.rmse": "RMSE",
    "metrics.mape": "MAPE",
    "metrics.confidence": "Confidence",
    "metrics.avgPredictionAccuracy": "Avg. Prediction Accuracy",
    "metrics.predictionPrecision": "Prediction Precision",
    "metrics.accuracyPercentage": "Accuracy Percentage",
    "metrics.modelConfidence": "Model Confidence",
    "metrics.tradingSignal": "Trading Signal",
    "metrics.strength": "Strength",
    "metrics.predictedChange": "Predicted Change",
    "metrics.detailedAnalysis": "Click here for Detailed Analysis",
    "metrics.understandingMetrics": "Understanding Metrics",
    "metrics.maeDescription":
      "Average deviation from actual price. Lower value = more accurate predictions.",
    "metrics.rmseDescription":
      "Measures prediction precision. Penalizes larger deviations more. Lower is better.",
    "metrics.mapeDescription":
      "Accuracy as percentage. <1% is excellent, <5% is very good, <10% is good.",
    "metrics.confidenceDescription":
      "Model's certainty in predictions. >80% = high confidence, >90% = very high confidence.",

    // Detailed Analysis Modal
    "analysis.title": "Detailed Prediction Analysis",
    "analysis.subtitle": "Comprehensive breakdown of {{symbol}} prediction",
    "analysis.tradingSignalAnalysis": "Trading Signal Analysis",
    "analysis.signal": "Signal",
    "analysis.signalStrength": "Signal Strength",
    "analysis.predictedPriceChange": "Predicted Price Change",
    "analysis.currentPrice": "Current Price",
    "analysis.predictedPrice": "Predicted Price",
    "analysis.reason": "Reason",
    "analysis.accuracyMetricsAnalysis": "Accuracy Metrics Analysis",
    "analysis.maeTitle": "MAE (Mean Absolute Error)",
    "analysis.rmseTitle": "RMSE (Root Mean Square Error)",
    "analysis.mapeTitle": "MAPE (Mean Absolute Percentage Error)",
    "analysis.confidenceTitle": "Model Confidence",
    "analysis.whatItMeans": "What it means:",
    "analysis.formula": "Formula:",
    "analysis.interpretation": "Interpretation:",
    "analysis.quality": "Quality:",
    "analysis.calculation": "Calculation:",
    "analysis.confidenceLevel": "Confidence Level:",
    "analysis.predictionMethodology": "Prediction Methodology",
    "analysis.modelType": "Model Type:",
    "analysis.hybridApproach":
      "A hybrid approach combining multiple statistical and technical analysis methods.",
    "analysis.technicalIndicators": "Technical Indicators Used:",
    "analysis.sma": "SMA (Simple Moving Average):",
    "analysis.smaDesc1": "Calculates average price over recent periods",
    "analysis.smaDesc2": "Smooths out price fluctuations to identify trends",
    "analysis.ema": "EMA (Exponential Moving Average):",
    "analysis.emaDesc1": "Gives more weight to recent prices",
    "analysis.emaDesc2": "More responsive to price changes than SMA",
    "analysis.rsi": "RSI (Relative Strength Index):",
    "analysis.rsiDesc1": "Measures momentum (0-100 scale)",
    "analysis.rsiDesc2": ">70 = overbought, <30 = oversold",
    "analysis.macd": "MACD (Moving Average Convergence Divergence):",
    "analysis.macdDesc1": "Shows trend direction and momentum",
    "analysis.macdDesc2": "Crossovers signal potential buy/sell points",
    "analysis.bollingerBands": "Bollinger Bands:",
    "analysis.bollingerDesc1": "Volatility indicator using standard deviations",
    "analysis.bollingerDesc2":
      "Prices touching bands may indicate reversal points",
    "analysis.predictionProcess": "Prediction Process:",
    "analysis.step1": "Data Collection: Gather historical OHLCV data",
    "analysis.step2": "Feature Engineering: Calculate technical indicators",
    "analysis.step3": "Model Training: Train on historical patterns",
    "analysis.step4": "Validation: Test accuracy on unseen data",
    "analysis.step5": "Prediction: Generate future price forecasts",
    "analysis.step6": "Confidence Scoring: Assess prediction reliability",

    // Analysis Additional Keys
    "analysis.priceTarget": "Price Target",
    "analysis.signalReasoning": "Signal Reasoning",
    "analysis.technicalAnalysisTitle": "Technical Analysis",
    "analysis.rsiIndicator": "RSI Indicator",
    "analysis.trendAnalysis": "Trend Analysis",
    "analysis.momentum": "Momentum",
    "analysis.signalLogic": "Signal Logic",
    "analysis.qualityRating": "Quality Rating",
    "analysis.reliability": "Reliability",
    "analysis.statisticalSummary": "Statistical Summary",
    "analysis.dataPointsUsed": "Data Points Used",
    "analysis.predictionsGenerated": "Predictions Generated",
    "analysis.priceVolatility": "Price Volatility",
    "analysis.priceRangePeriod": "Price Range (Period)",
    "analysis.avgVolume": "Avg. Volume",
    "analysis.aiPoweredAnalysis": "AI-Powered Analysis",
    "analysis.poweredByGemini": "Powered by Google Gemini AI",
    "analysis.executiveSummary": "Executive Summary",
    "analysis.marketSentiment": "Market Sentiment",
    "analysis.keyInsights": "Key Insights",
    "analysis.recentNews": "Recent News",
    "analysis.potentialRisks": "Potential Risks",
    "analysis.potentialOpportunities": "Potential Opportunities",
    "analysis.aiRecommendation": "AI Recommendation",
    "analysis.importantDisclaimer": "Important Disclaimer:",
    "analysis.disclaimerText":
      "This analysis is for educational and informational purposes only. Past performance does not guarantee future results. Always conduct your own research and consult with qualified financial advisors before making investment decisions. Trading and investing carry inherent risks, including the potential loss of principal.",
    "analysis.veryHigh": "Very High",
    "analysis.high": "High",
    "analysis.fair": "Fair",
    "analysis.low": "Low",
    "analysis.veryLow": "Very Low",
    "analysis.basedOnValidation":
      "Based on validation performance - how well the model predicted held-out historical data.",
    "analysis.highReliability": "High reliability - Strong conviction",
    "analysis.moderateReliability": "Moderate reliability - Good confidence",
    "analysis.lowReliability": "Low reliability - Consider as reference only",
    "analysis.veryLowReliability": "Very low reliability - High uncertainty",
    "analysis.usedToIdentify":
      "Used to identify overbought/oversold conditions",
    "analysis.basedOnMovingAverages": "Based on moving averages (SMA & EMA)",
    "analysis.calculatedFromRecent": "Calculated from recent price movements",
    "analysis.rsiLogic":
      "RSI < 30 = Oversold (BUY), RSI > 70 = Overbought (SELL), else HOLD",

    // Analysis - Additional Translations
    "analysis.onAveragePredictionsDeviate":
      "On average, our predictions deviate by",
    "analysis.fromActualPrices": "from actual prices",
    "analysis.lowerIsBetter": "Lower is better. For a",
    "analysis.stockThisRepresents": "stock, this represents a",
    "analysis.averageDeviation": "average deviation",
    "analysis.measuresPrecision":
      "Measures prediction precision, giving more weight to larger errors",
    "analysis.rmseSlightlyHigher": "RMSE is slightly higher than MAE",
    "analysis.indicatingConsistent":
      "indicating relatively consistent prediction errors",
    "analysis.predictionsAccurateWithin": "Our predictions are accurate within",
    "analysis.onAverage": "on average",
    "analysis.thisMeans": "This means",
    "analysis.predictionAccuracy": "prediction accuracy!",
    "analysis.youAreHere": "You are here!",
    "analysis.calculatesAveragePrice":
      "Calculates average price over recent periods",
    "analysis.smoothsOutFluctuations":
      "Smooths out price fluctuations to identify trends",
    "analysis.givesMoreWeight": "Gives more weight to recent prices",
    "analysis.moreResponsive": "More responsive to price changes than SMA",
    "analysis.measuresMomentum":
      "Measures momentum and overbought/oversold conditions",
    "analysis.range0to100":
      "Range: 0-100, with 70+ = overbought, 30- = oversold",
    "analysis.step1Collect": "Step 1: Collect",
    "analysis.historicalDataPoints":
      "historical data points from Yahoo Finance API",
    "analysis.step2Calculate":
      "Step 2: Calculate SMA, EMA, and RSI for trend analysis",
    "analysis.step3Combine":
      "Step 3: Combine trend (40%), mean reversion (30%), and momentum (30%) components",
    "analysis.step4Generate": "Step 4: Generate",
    "analysis.futurePredictions":
      "future predictions with confidence intervals",
    "analysis.step5Backtest":
      "Step 5: Backtest on historical data to validate accuracy (10% holdout)",
    "analysis.step6Calculate":
      "Step 6: Calculate metrics (MAE, RMSE, MAPE) and confidence score",
    "analysis.step7Generate":
      "Step 7: Generate trading signal based on RSI and price trends",
    "analysis.generatingAIAnalysis": "Generating AI analysis...",
    "analysis.unableToLoad":
      "Unable to load AI analysis. Please try again later.",

    // Common
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.searching": "Searching...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.save": "Save",
    "common.noResults": "No results found",

    // Chart
    "chart.title": "Price Chart",
    "chart.candlestick": "Candlestick Chart",
    "chart.line": "Line Chart",
    "chart.area": "Area Chart",
    "chart.bar": "Bar Chart",

    // Price Display
    "price.current": "Current Price",
    "price.realtime": "Real-time",
    "price.prediction": "Prediction",
    "price.in": "in",

    // Market Status
    "market.status": "Market Status",
    "market.exchange": "Exchange",
    "market.tradingHours": "Trading Hours",
    "market.opensIn": "Opens in",
    "market.closesIn": "Closes in",
    "market.regularTrading": "Regular Trading",
    "market.preMarket": "Pre-Market Trading",
    "market.afterHours": "After-Hours Trading",
    "market.closed": "Market Closed",

    // Additional Prediction Page Keys
    "prediction.analysisSignal": "Analysis & Signal",
    "prediction.priceChartTitle": "Price Chart",
    "prediction.technicalIndicators": "Technical Indicators",
    "prediction.aiSentiment": "AI Sentiment",
    "prediction.eventImpact": "Event Impact",
    "prediction.rsi": "RSI",
    "prediction.macd": "MACD",
    "prediction.volume": "Volume",
    "prediction.volatility": "Volatility",
    "prediction.bullish": "Bullish",
    "prediction.bearish": "Bearish",
    "prediction.neutral": "Neutral",
    "prediction.strong": "Strong",
    "prediction.moderate": "Moderate",
    "prediction.weak": "Weak",
    "prediction.buy": "BUY",
    "prediction.sell": "SELL",
    "prediction.hold": "HOLD",
    "prediction.poweredBy": "Powered by",
    "prediction.change": "Change",

    // Intervals
    "interval.1m": "1 Minute",
    "interval.5m": "5 Minutes",
    "interval.15m": "15 Minutes",
    "interval.30m": "30 Minutes",
    "interval.1h": "1 Hour",
    "interval.4h": "4 Hours",
    "interval.1d": "1 Day",
    "interval.1w": "1 Week",
    "interval.1mo": "1 Month",
  },

  ID: {
    // Header
    "header.dashboard": "Dasbor",
    "header.search": "Cari",
    "header.prediction": "Prediksi",
    "header.profile": "Profil",
    "header.logout": "Keluar",
    "header.signIn": "Masuk",
    "header.getStarted": "Mulai Sekarang",

    // Hero Section
    "hero.tagline1": "Cara",
    "hero.tagline2": "tercepat",
    "hero.tagline3": "untuk",
    "hero.tagline4": "trading",
    "hero.tagline5": "saham dengan",
    "hero.tagline6": "portofolio Anda",
    "hero.subtitle":
      "Hasilkan wawasan trading dengan cepat dan mudah menggunakan AI, tanpa meninggalkan Ikodio",
    "hero.getStarted": "Mulai Sekarang",
    "hero.learnMore": "Pelajari Lebih Lanjut",
    "hero.watchDemo": "Tonton Demo",

    // Landing Page
    "landing.title": "Selamat Datang di Ikodio",
    "landing.subtitle": "Platform Trading Bertenaga AI",

    // Dashboard
    "dashboard.title": "Dasbor",
    "dashboard.marketOverview": "Tinjauan Pasar",
    "dashboard.stockHeatmap": "Peta Panas Saham",
    "dashboard.topStories": "Berita Utama",
    "dashboard.marketData": "Data Pasar",
    "dashboard.timeline": "Linimasa",
    "dashboard.backToDashboard": "Kembali ke Dasbor",

    // Prediction Page
    "prediction.title": "Prediksi Saham",
    "prediction.subtitle":
      "Prediksi harga saham bertenaga AI dengan analisis time series tingkat lanjut",
    "prediction.subtitleIntraday":
      "Prediksi intraday bertenaga AI untuk trader harian",
    "prediction.disclaimer": "Penyangkalan:",
    "prediction.disclaimerText":
      "Prediksi ini hanya untuk tujuan edukasi. Tidak menjamin hasil investasi. Selalu lakukan riset sendiri dan konsultasi dengan penasihat keuangan sebelum membuat keputusan investasi.",
    "prediction.selectStock": "Pilih Saham",
    "prediction.selectStockLabel": "Pilih Saham",
    "prediction.timeInterval": "Interval Waktu",
    "prediction.predictionInterval": "Interval Prediksi",
    "prediction.generatePrediction": "Buat Prediksi",
    "prediction.generating": "Membuat...",
    "prediction.analyzing": "Menganalisis data pasar dan membuat prediksi...",
    "prediction.priceChart": "Grafik Harga & Prediksi",
    "prediction.chartInfo":
      "Grafik menampilkan harga historis (candlestick) dan harga prediksi (garis ungu) dengan pita kepercayaan (area hijau/merah)",
    "prediction.metricsAndSignal": "Metrik & Sinyal Prediksi",
    "prediction.modelInfo": "Informasi Model",
    "prediction.model": "Model",
    "prediction.interval": "Interval",
    "prediction.predictionTime": "Waktu Prediksi",
    "prediction.readyToPredict": "Siap Memprediksi",
    "prediction.readyDescription":
      'Pilih saham dan interval prediksi di atas, lalu klik "Buat Prediksi" untuk melihat perkiraan harga bertenaga AI dengan metrik detail.',
    "prediction.dailyPrediction": "Prediksi harian",
    "prediction.errorSelectStock": "Silakan pilih saham terlebih dahulu",
    "prediction.errorFailed": "Gagal membuat prediksi",
    "prediction.predictionFailed": "Prediksi gagal",

    // Metrics
    "metrics.mae": "MAE",
    "metrics.rmse": "RMSE",
    "metrics.mape": "MAPE",
    "metrics.confidence": "Kepercayaan",
    "metrics.avgPredictionAccuracy": "Rata-rata Akurasi Prediksi",
    "metrics.predictionPrecision": "Presisi Prediksi",
    "metrics.accuracyPercentage": "Persentase Akurasi",
    "metrics.modelConfidence": "Kepercayaan Model",
    "metrics.tradingSignal": "Sinyal Trading",
    "metrics.strength": "Kekuatan",
    "metrics.predictedChange": "Perubahan Prediksi",
    "metrics.detailedAnalysis": "Klik di sini untuk Analisis Detail",
    "metrics.understandingMetrics": "Memahami Metrik",
    "metrics.maeDescription":
      "Deviasi rata-rata dari harga aktual. Nilai lebih rendah = prediksi lebih akurat.",
    "metrics.rmseDescription":
      "Mengukur presisi prediksi. Lebih menghukum deviasi besar. Lebih rendah lebih baik.",
    "metrics.mapeDescription":
      "Akurasi sebagai persentase. <1% sangat baik, <5% baik sekali, <10% baik.",
    "metrics.confidenceDescription":
      "Kepastian model dalam prediksi. >80% = kepercayaan tinggi, >90% = kepercayaan sangat tinggi.",

    // Detailed Analysis Modal
    "analysis.title": "Analisis Prediksi Detail",
    "analysis.subtitle": "Rincian lengkap prediksi {{symbol}}",
    "analysis.tradingSignalAnalysis": "Analisis Sinyal Trading",
    "analysis.signal": "Sinyal",
    "analysis.signalStrength": "Kekuatan Sinyal",
    "analysis.predictedPriceChange": "Perubahan Harga Prediksi",
    "analysis.currentPrice": "Harga Saat Ini",
    "analysis.predictedPrice": "Harga Prediksi",
    "analysis.reason": "Alasan",
    "analysis.accuracyMetricsAnalysis": "Analisis Metrik Akurasi",
    "analysis.maeTitle": "MAE (Mean Absolute Error)",
    "analysis.rmseTitle": "RMSE (Root Mean Square Error)",
    "analysis.mapeTitle": "MAPE (Mean Absolute Percentage Error)",
    "analysis.confidenceTitle": "Kepercayaan Model",
    "analysis.whatItMeans": "Artinya:",
    "analysis.formula": "Rumus:",
    "analysis.interpretation": "Interpretasi:",
    "analysis.quality": "Kualitas:",
    "analysis.calculation": "Perhitungan:",
    "analysis.confidenceLevel": "Tingkat Kepercayaan:",
    "analysis.predictionMethodology": "Metodologi Prediksi",
    "analysis.modelType": "Tipe Model:",
    "analysis.hybridApproach":
      "Pendekatan hybrid yang menggabungkan beberapa metode analisis statistik dan teknikal.",
    "analysis.technicalIndicators": "Indikator Teknikal yang Digunakan:",
    "analysis.sma": "SMA (Simple Moving Average):",
    "analysis.smaDesc1": "Menghitung harga rata-rata selama periode terakhir",
    "analysis.smaDesc2":
      "Menghaluskan fluktuasi harga untuk mengidentifikasi tren",
    "analysis.ema": "EMA (Exponential Moving Average):",
    "analysis.emaDesc1": "Memberikan bobot lebih pada harga terbaru",
    "analysis.emaDesc2":
      "Lebih responsif terhadap perubahan harga daripada SMA",
    "analysis.rsi": "RSI (Relative Strength Index):",
    "analysis.rsiDesc1": "Mengukur momentum (skala 0-100)",
    "analysis.rsiDesc2": ">70 = overbought, <30 = oversold",
    "analysis.macd": "MACD (Moving Average Convergence Divergence):",
    "analysis.macdDesc1": "Menampilkan arah tren dan momentum",
    "analysis.macdDesc2": "Crossover memberi sinyal potensial buy/sell",
    "analysis.bollingerBands": "Bollinger Bands:",
    "analysis.bollingerDesc1":
      "Indikator volatilitas menggunakan standar deviasi",
    "analysis.bollingerDesc2":
      "Harga menyentuh band dapat menunjukkan titik pembalikan",
    "analysis.predictionProcess": "Proses Prediksi:",
    "analysis.step1": "Pengumpulan Data: Mengumpulkan data OHLCV historis",
    "analysis.step2": "Feature Engineering: Menghitung indikator teknikal",
    "analysis.step3": "Pelatihan Model: Melatih pola historis",
    "analysis.step4": "Validasi: Menguji akurasi pada data yang belum terlihat",
    "analysis.step5": "Prediksi: Menghasilkan perkiraan harga masa depan",
    "analysis.step6": "Penilaian Kepercayaan: Menilai keandalan prediksi",

    // Detailed Analysis Modal - Extended
    "analysis.priceTarget": "Target Harga",
    "analysis.signalReasoning": "Alasan Sinyal",
    "analysis.technicalAnalysisTitle": "Analisis Teknikal",
    "analysis.statisticalSummary": "Ringkasan Statistik",
    "analysis.dataPointsUsed": "Titik Data Digunakan",
    "analysis.predictionsGenerated": "Prediksi Dibuat",
    "analysis.priceVolatility": "Volatilitas Harga",
    "analysis.avgVolume": "Volume Rata-rata",
    "analysis.aiPoweredAnalysis": "Analisis Bertenaga AI",
    "analysis.poweredByGemini": "Didukung oleh Gemini AI",
    "analysis.executiveSummary": "Ringkasan Eksekutif",
    "analysis.marketSentiment": "Sentimen Pasar",
    "analysis.keyInsights": "Wawasan Utama",
    "analysis.recentNews": "Berita Terkini",
    "analysis.potentialRisks": "Risiko Potensial",
    "analysis.potentialOpportunities": "Peluang Potensial",
    "analysis.aiRecommendation": "Rekomendasi AI",
    "analysis.disclaimerText":
      "Analisis AI ini bersifat informasional dan tidak boleh dianggap sebagai nasihat keuangan. Selalu lakukan riset Anda sendiri dan berkonsultasi dengan penasihat keuangan berlisensi sebelum membuat keputusan investasi.",
    "analysis.veryHigh": "Sangat Tinggi",
    "analysis.high": "Tinggi",
    "analysis.fair": "Cukup",
    "analysis.low": "Rendah",
    "analysis.veryLow": "Sangat Rendah",
    "analysis.excellent": "Sangat Baik",
    "analysis.veryGood": "Sangat Baik",
    "analysis.good": "Baik",
    "analysis.moderate": "Sedang",
    "analysis.poor": "Buruk",
    "analysis.reliabilityVeryHigh": "Sangat Andal",
    "analysis.reliabilityHigh": "Andal",
    "analysis.reliabilityModerate": "Cukup Andal",
    "analysis.reliabilityLow": "Kurang Andal",
    "analysis.rsiLogic":
      "RSI {{rsi}} menunjukkan saham {{condition}}. Sinyal {{signal}} dengan kekuatan {{strength}}.",

    // Analysis - Additional Translations ID
    "analysis.onAveragePredictionsDeviate":
      "Rata-rata, prediksi kami menyimpang sebesar",
    "analysis.fromActualPrices": "dari harga aktual",
    "analysis.lowerIsBetter": "Lebih rendah lebih baik. Untuk saham",
    "analysis.stockThisRepresents": "ini mewakili",
    "analysis.averageDeviation": "deviasi rata-rata",
    "analysis.measuresPrecision":
      "Mengukur presisi prediksi, memberikan bobot lebih pada kesalahan yang lebih besar",
    "analysis.rmseSlightlyHigher": "RMSE sedikit lebih tinggi dari MAE",
    "analysis.indicatingConsistent":
      "menunjukkan kesalahan prediksi yang relatif konsisten",
    "analysis.predictionsAccurateWithin": "Prediksi kami akurat dalam kisaran",
    "analysis.onAverage": "rata-rata",
    "analysis.thisMeans": "Ini berarti",
    "analysis.predictionAccuracy": "akurasi prediksi!",
    "analysis.youAreHere": "Anda di sini!",
    "analysis.calculatesAveragePrice":
      "Menghitung harga rata-rata selama periode terakhir",
    "analysis.smoothsOutFluctuations":
      "Menghaluskan fluktuasi harga untuk mengidentifikasi tren",
    "analysis.givesMoreWeight": "Memberikan bobot lebih pada harga terbaru",
    "analysis.moreResponsive":
      "Lebih responsif terhadap perubahan harga daripada SMA",
    "analysis.measuresMomentum":
      "Mengukur momentum dan kondisi overbought/oversold",
    "analysis.range0to100":
      "Rentang: 0-100, dengan 70+ = overbought, 30- = oversold",
    "analysis.step1Collect": "Langkah 1: Kumpulkan",
    "analysis.historicalDataPoints":
      "titik data historis dari Yahoo Finance API",
    "analysis.step2Calculate":
      "Langkah 2: Hitung SMA, EMA, dan RSI untuk analisis tren",
    "analysis.step3Combine":
      "Langkah 3: Gabungkan komponen tren (40%), mean reversion (30%), dan momentum (30%)",
    "analysis.step4Generate": "Langkah 4: Hasilkan",
    "analysis.futurePredictions":
      "prediksi masa depan dengan interval kepercayaan",
    "analysis.step5Backtest":
      "Langkah 5: Backtest pada data historis untuk memvalidasi akurasi (10% holdout)",
    "analysis.step6Calculate":
      "Langkah 6: Hitung metrik (MAE, RMSE, MAPE) dan skor kepercayaan",
    "analysis.step7Generate":
      "Langkah 7: Hasilkan sinyal trading berdasarkan RSI dan tren harga",
    "analysis.generatingAIAnalysis": "Membuat analisis AI...",
    "analysis.unableToLoad":
      "Tidak dapat memuat analisis AI. Silakan coba lagi nanti.",

    // Market Status

    // Common
    "common.close": "Tutup",
    "common.loading": "Memuat...",
    "common.searching": "Mencari...",
    "common.error": "Kesalahan",
    "common.success": "Berhasil",
    "common.cancel": "Batal",
    "common.confirm": "Konfirmasi",
    "common.save": "Simpan",
    "common.noResults": "Tidak ada hasil",

    // Chart
    "chart.title": "Grafik Harga",
    "chart.candlestick": "Grafik Candlestick",
    "chart.line": "Grafik Garis",
    "chart.area": "Grafik Area",
    "chart.bar": "Grafik Batang",

    // Price Display
    "price.current": "Harga Saat Ini",
    "price.realtime": "Real-time",
    "price.prediction": "Prediksi",
    "price.in": "dalam",

    // Market Status
    "market.status": "Status Pasar",
    "market.exchange": "Bursa",
    "market.tradingHours": "Jam Trading",
    "market.opensIn": "Buka dalam",
    "market.closesIn": "Tutup dalam",
    "market.regularTrading": "Trading Reguler",
    "market.preMarket": "Trading Pre-Market",
    "market.afterHours": "Trading After-Hours",
    "market.closed": "Pasar Tutup",

    // Additional Prediction Page Keys
    "prediction.analysisSignal": "Analisis & Sinyal",
    "prediction.priceChartTitle": "Grafik Harga",
    "prediction.technicalIndicators": "Indikator Teknikal",
    "prediction.aiSentiment": "Sentimen AI",
    "prediction.eventImpact": "Dampak Event",
    "prediction.rsi": "RSI",
    "prediction.macd": "MACD",
    "prediction.volume": "Volume",
    "prediction.volatility": "Volatilitas",
    "prediction.bullish": "Bullish",
    "prediction.bearish": "Bearish",
    "prediction.neutral": "Netral",
    "prediction.strong": "Kuat",
    "prediction.moderate": "Sedang",
    "prediction.weak": "Lemah",
    "prediction.buy": "BELI",
    "prediction.sell": "JUAL",
    "prediction.hold": "TAHAN",
    "prediction.poweredBy": "Didukung oleh",
    "prediction.change": "Perubahan",

    // Intervals
    "interval.1m": "1 Menit",
    "interval.5m": "5 Menit",
    "interval.15m": "15 Menit",
    "interval.30m": "30 Menit",
    "interval.1h": "1 Jam",
    "interval.4h": "4 Jam",
    "interval.1d": "1 Hari",
    "interval.1w": "1 Minggu",
    "interval.1mo": "1 Bulan",
  },

  // Spanish
  ES: {
    "header.dashboard": "Panel",
    "header.search": "Buscar",
    "header.prediction": "Predicción",
    "header.profile": "Perfil",
    "header.logout": "Cerrar sesión",
    "header.signIn": "Iniciar sesión",
    "prediction.title": "Predicción de acciones",
    "prediction.subtitle":
      "Predicciones de precios de acciones impulsadas por IA con análisis avanzado de series temporales",
    "prediction.disclaimer": "Descargo de responsabilidad:",
    "prediction.disclaimerText":
      "Estas predicciones son solo con fines educativos. No garantizan resultados de inversión. Siempre haga su propia investigación y consulte con asesores financieros antes de tomar decisiones de inversión.",
    "prediction.selectStock": "Seleccionar acción",
    "prediction.predictionInterval": "Intervalo de predicción",
    "prediction.generatePrediction": "Generar predicción",
    "prediction.generating": "Generando...",
    "prediction.analyzing":
      "Analizando datos del mercado y generando predicciones...",
    "prediction.priceChart": "Gráfico de precios y predicciones",
    "prediction.chartInfo":
      "El gráfico muestra precios históricos (velas) y precios predichos (línea púrpura) con bandas de confianza (áreas sombreadas verde/rojo)",
    "prediction.metricsAndSignal": "Métricas de predicción y señal",
    "prediction.modelInfo": "Información del modelo",
    "prediction.model": "Modelo",
    "prediction.interval": "Intervalo",
    "prediction.predictionTime": "Tiempo de predicción",
    "prediction.readyToPredict": "Listo para predecir",
    "prediction.readyDescription":
      'Seleccione una acción e intervalo de predicción arriba, luego haga clic en "Generar predicción" para ver pronósticos de precios impulsados por IA con métricas detalladas.',
    "metrics.mae": "MAE",
    "metrics.rmse": "RMSE",
    "metrics.mape": "MAPE",
    "metrics.confidence": "Confianza",
    "metrics.avgPredictionAccuracy": "Precisión promedio de predicción",
    "metrics.predictionPrecision": "Precisión de predicción",
    "metrics.accuracyPercentage": "Porcentaje de precisión",
    "metrics.modelConfidence": "Confianza del modelo",
    "metrics.tradingSignal": "Señal de trading",
    "metrics.strength": "Fuerza",
    "metrics.predictedChange": "Cambio predicho",
    "metrics.detailedAnalysis": "Haga clic aquí para análisis detallado",
    "metrics.understandingMetrics": "Comprensión de métricas",
    "metrics.maeDescription":
      "Desviación promedio del precio real. Valor más bajo = predicciones más precisas.",
    "metrics.rmseDescription":
      "Mide la precisión de la predicción. Penaliza las desviaciones más grandes. Menor es mejor.",
    "metrics.mapeDescription":
      "Precisión como porcentaje. <1% es excelente, <5% es muy bueno, <10% es bueno.",
    "metrics.confidenceDescription":
      "Certeza del modelo en las predicciones. >80% = alta confianza, >90% = muy alta confianza.",
    "analysis.title": "Análisis detallado de predicción",
    "analysis.subtitle": "Desglose completo de la predicción de {{symbol}}",
    "common.close": "Cerrar",
    "common.save": "Guardar",

    // Chart
    "chart.title": "Gráfico de Precios",
    "chart.candlestick": "Gráfico de Velas",
    "chart.line": "Gráfico de Líneas",
    "chart.area": "Gráfico de Área",
    "chart.bar": "Gráfico de Barras",

    // Price Display
    "price.current": "Precio Actual",
    "price.realtime": "Tiempo Real",
    "price.prediction": "Predicción",
    "price.in": "en",

    // Additional Prediction Page Keys
    "prediction.analysisSignal": "Análisis y Señal",
    "prediction.priceChartTitle": "Gráfico de Precios",
    "prediction.technicalIndicators": "Indicadores Técnicos",
    "prediction.aiSentiment": "Sentimiento de IA",
    "prediction.eventImpact": "Impacto de Eventos",
    "prediction.rsi": "RSI",
    "prediction.macd": "MACD",
    "prediction.volume": "Volumen",
    "prediction.volatility": "Volatilidad",
    "prediction.bullish": "Alcista",
    "prediction.bearish": "Bajista",
    "prediction.neutral": "Neutral",
    "prediction.strong": "Fuerte",
    "prediction.moderate": "Moderado",
    "prediction.weak": "Débil",
    "prediction.buy": "COMPRAR",
    "prediction.sell": "VENDER",
    "prediction.hold": "MANTENER",
  },

  // Chinese
  ZH: {
    "header.dashboard": "仪表板",
    "header.search": "搜索",
    "header.prediction": "预测",
    "header.profile": "个人资料",
    "header.logout": "登出",
    "header.signIn": "登录",
    "prediction.title": "股票预测",
    "prediction.subtitle": "基于先进时间序列分析的AI驱动股票价格预测",
    "prediction.disclaimer": "免责声明：",
    "prediction.disclaimerText":
      "这些预测仅供教育目的。它们不保证投资结果。在做出投资决定之前，请务必进行自己的研究并咨询财务顾问。",
    "prediction.selectStock": "选择股票",
    "prediction.predictionInterval": "预测间隔",
    "prediction.generatePrediction": "生成预测",
    "prediction.generating": "生成中...",
    "prediction.analyzing": "分析市场数据并生成预测...",
    "prediction.priceChart": "价格图表与预测",
    "prediction.chartInfo":
      "图表显示历史价格（蜡烛图）和预测价格（紫色线）以及置信带（绿色/红色阴影区域）",
    "prediction.metricsAndSignal": "预测指标与信号",
    "prediction.modelInfo": "模型信息",
    "prediction.model": "模型",
    "prediction.interval": "间隔",
    "prediction.predictionTime": "预测时间",
    "prediction.readyToPredict": "准备预测",
    "prediction.readyDescription":
      '在上方选择股票和预测间隔，然后点击"生成预测"以查看带有详细指标的AI驱动价格预测。',
    "metrics.mae": "平均绝对误差",
    "metrics.rmse": "均方根误差",
    "metrics.mape": "平均绝对百分比误差",
    "metrics.confidence": "置信度",
    "metrics.avgPredictionAccuracy": "平均预测准确度",
    "metrics.predictionPrecision": "预测精度",
    "metrics.accuracyPercentage": "准确度百分比",
    "metrics.modelConfidence": "模型置信度",
    "metrics.tradingSignal": "交易信号",
    "metrics.strength": "强度",
    "metrics.predictedChange": "预测变化",
    "metrics.detailedAnalysis": "点击此处查看详细分析",
    "metrics.understandingMetrics": "理解指标",
    "metrics.maeDescription": "与实际价格的平均偏差。值越低 = 预测越准确。",
    "metrics.rmseDescription": "衡量预测精度。对较大偏差的惩罚更大。越低越好。",
    "metrics.mapeDescription":
      "准确度百分比。<1%为优秀，<5%为非常好，<10%为好。",
    "metrics.confidenceDescription":
      "模型对预测的确定性。>80% = 高置信度，>90% = 非常高置信度。",
    "common.close": "关闭",
    "common.save": "保存",

    // Chart
    "chart.title": "价格图表",
    "chart.candlestick": "蜡烛图",
    "chart.line": "折线图",
    "chart.area": "面积图",
    "chart.bar": "柱状图",

    // Price Display
    "price.current": "当前价格",
    "price.realtime": "实时",
    "price.prediction": "预测",
    "price.in": "在",

    // Additional Prediction Page Keys
    "prediction.analysisSignal": "分析与信号",
    "prediction.priceChartTitle": "价格图表",
    "prediction.technicalIndicators": "技术指标",
    "prediction.aiSentiment": "AI情感",
    "prediction.eventImpact": "事件影响",
    "prediction.rsi": "RSI",
    "prediction.macd": "MACD",
    "prediction.volume": "成交量",
    "prediction.volatility": "波动率",
    "prediction.bullish": "看涨",
    "prediction.bearish": "看跌",
    "prediction.neutral": "中性",
    "prediction.strong": "强",
    "prediction.moderate": "中等",
    "prediction.weak": "弱",
    "prediction.buy": "买入",
    "prediction.sell": "卖出",
    "prediction.hold": "持有",
  },

  // Japanese
  JA: {
    "header.dashboard": "ダッシュボード",
    "header.search": "検索",
    "header.prediction": "予測",
    "header.profile": "プロフィール",
    "header.logout": "ログアウト",
    "header.signIn": "ログイン",
    "prediction.title": "株価予測",
    "prediction.subtitle": "高度な時系列分析によるAI駆動の株価予測",
    "prediction.disclaimer": "免責事項：",
    "prediction.disclaimerText":
      "これらの予測は教育目的のみです。投資結果を保証するものではありません。投資決定を行う前に、必ず自分で調査し、ファイナンシャルアドバイザーに相談してください。",
    "prediction.selectStock": "株式を選択",
    "prediction.predictionInterval": "予測間隔",
    "prediction.generatePrediction": "予測を生成",
    "prediction.generating": "生成中...",
    "prediction.analyzing": "市場データを分析し予測を生成中...",
    "prediction.priceChart": "価格チャートと予測",
    "prediction.chartInfo":
      "チャートは過去の価格（ローソク足）と予測価格（紫色の線）、信頼バンド（緑/赤の陰影領域）を示します",
    "prediction.metricsAndSignal": "予測メトリクスとシグナル",
    "prediction.modelInfo": "モデル情報",
    "prediction.model": "モデル",
    "prediction.interval": "間隔",
    "prediction.predictionTime": "予測時刻",
    "prediction.readyToPredict": "予測の準備完了",
    "prediction.readyDescription":
      "上記で株式と予測間隔を選択し、「予測を生成」をクリックして、詳細なメトリクスを含むAI駆動の価格予測を表示します。",
    "metrics.mae": "平均絶対誤差",
    "metrics.rmse": "二乗平均平方根誤差",
    "metrics.mape": "平均絶対パーセント誤差",
    "metrics.confidence": "信頼度",
    "metrics.avgPredictionAccuracy": "平均予測精度",
    "metrics.predictionPrecision": "予測精度",
    "metrics.accuracyPercentage": "精度パーセンテージ",
    "metrics.modelConfidence": "モデル信頼度",
    "metrics.tradingSignal": "トレーディングシグナル",
    "metrics.strength": "強度",
    "metrics.predictedChange": "予測変化",
    "metrics.detailedAnalysis": "詳細な分析はこちらをクリック",
    "metrics.understandingMetrics": "メトリクスの理解",
    "metrics.maeDescription":
      "実際の価格からの平均偏差。値が低いほど予測が正確です。",
    "metrics.rmseDescription":
      "予測精度を測定します。大きな偏差をより重く罰します。低いほど良いです。",
    "metrics.mapeDescription":
      "パーセンテージとしての精度。<1%は優秀、<5%は非常に良い、<10%は良いです。",
    "metrics.confidenceDescription":
      "予測に対するモデルの確実性。>80% = 高い信頼度、>90% = 非常に高い信頼度。",
    "common.close": "閉じる",
    "common.save": "保存",

    // Chart
    "chart.title": "価格チャート",
    "chart.candlestick": "ローソク足チャート",
    "chart.line": "折れ線グラフ",
    "chart.area": "エリアチャート",
    "chart.bar": "棒グラフ",

    // Price Display
    "price.current": "現在価格",
    "price.realtime": "リアルタイム",
    "price.prediction": "予測",
    "price.in": "で",

    // Additional Prediction Page Keys
    "prediction.analysisSignal": "分析とシグナル",
    "prediction.priceChartTitle": "価格チャート",
    "prediction.technicalIndicators": "テクニカル指標",
    "prediction.aiSentiment": "AIセンチメント",
    "prediction.eventImpact": "イベント影響",
    "prediction.rsi": "RSI",
    "prediction.macd": "MACD",
    "prediction.volume": "出来高",
    "prediction.volatility": "ボラティリティ",
    "prediction.bullish": "強気",
    "prediction.bearish": "弱気",
    "prediction.neutral": "中立",
    "prediction.strong": "強い",
    "prediction.moderate": "中程度",
    "prediction.weak": "弱い",
    "prediction.buy": "買い",
    "prediction.sell": "売り",
    "prediction.hold": "保持",
  },

  // Korean
  KO: {
    "header.dashboard": "대시보드",
    "header.search": "검색",
    "header.prediction": "예측",
    "header.profile": "프로필",
    "header.logout": "로그아웃",
    "header.signIn": "로그인",
    "prediction.title": "주가 예측",
    "prediction.subtitle": "고급 시계열 분석을 활용한 AI 기반 주가 예측",
    "prediction.disclaimer": "면책 조항:",
    "prediction.disclaimerText":
      "이러한 예측은 교육 목적으로만 제공됩니다. 투자 결과를 보장하지 않습니다. 투자 결정을 내리기 전에 항상 스스로 조사하고 재무 고문과 상담하십시오.",
    "prediction.selectStock": "주식 선택",
    "prediction.predictionInterval": "예측 간격",
    "prediction.generatePrediction": "예측 생성",
    "prediction.generating": "생성 중...",
    "prediction.analyzing": "시장 데이터를 분석하고 예측을 생성하는 중...",
    "prediction.priceChart": "가격 차트 및 예측",
    "prediction.chartInfo":
      "차트는 과거 가격(캔들스틱)과 예측 가격(보라색 선), 신뢰 구간(녹색/빨간색 음영 영역)을 보여줍니다",
    "prediction.metricsAndSignal": "예측 지표 및 신호",
    "prediction.modelInfo": "모델 정보",
    "prediction.model": "모델",
    "prediction.interval": "간격",
    "prediction.predictionTime": "예측 시간",
    "prediction.readyToPredict": "예측 준비 완료",
    "prediction.readyDescription":
      '위에서 주식과 예측 간격을 선택한 다음 "예측 생성"을 클릭하여 상세한 지표가 포함된 AI 기반 가격 예측을 확인하세요.',
    "metrics.mae": "평균 절대 오차",
    "metrics.rmse": "제곱근 평균 제곱 오차",
    "metrics.mape": "평균 절대 백분율 오차",
    "metrics.confidence": "신뢰도",
    "metrics.avgPredictionAccuracy": "평균 예측 정확도",
    "metrics.predictionPrecision": "예측 정밀도",
    "metrics.accuracyPercentage": "정확도 백분율",
    "metrics.modelConfidence": "모델 신뢰도",
    "metrics.tradingSignal": "거래 신호",
    "metrics.strength": "강도",
    "metrics.predictedChange": "예측 변화",
    "metrics.detailedAnalysis": "자세한 분석을 보려면 여기를 클릭",
    "metrics.understandingMetrics": "지표 이해",
    "metrics.maeDescription":
      "실제 가격과의 평균 편차. 값이 낮을수록 예측이 정확합니다.",
    "metrics.rmseDescription":
      "예측 정밀도를 측정합니다. 큰 편차에 더 큰 페널티를 부과합니다. 낮을수록 좋습니다.",
    "metrics.mapeDescription":
      "백분율로 나타낸 정확도. <1%는 우수, <5%는 매우 좋음, <10%는 좋음입니다.",
    "metrics.confidenceDescription":
      "예측에 대한 모델의 확실성. >80% = 높은 신뢰도, >90% = 매우 높은 신뢰도.",
    "common.close": "닫기",
    "common.save": "저장",

    // Chart
    "chart.title": "가격 차트",
    "chart.candlestick": "캔들스틱 차트",
    "chart.line": "선 그래프",
    "chart.area": "영역 차트",
    "chart.bar": "막대 그래프",

    // Price Display
    "price.current": "현재 가격",
    "price.realtime": "실시간",
    "price.prediction": "예측",
    "price.in": "에서",

    // Additional Prediction Page Keys
    "prediction.analysisSignal": "분석 및 신호",
    "prediction.priceChartTitle": "가격 차트",
    "prediction.technicalIndicators": "기술 지표",
    "prediction.aiSentiment": "AI 감정",
    "prediction.eventImpact": "이벤트 영향",
    "prediction.rsi": "RSI",
    "prediction.macd": "MACD",
    "prediction.volume": "거래량",
    "prediction.volatility": "변동성",
    "prediction.bullish": "상승세",
    "prediction.bearish": "하락세",
    "prediction.neutral": "중립",
    "prediction.strong": "강함",
    "prediction.moderate": "보통",
    "prediction.weak": "약함",
    "prediction.buy": "매수",
    "prediction.sell": "매도",
    "prediction.hold": "보유",
  },

  // Placeholder untuk bahasa lainnya (akan menggunakan EN sebagai fallback)
  FR: {},
  DE: {},
  IT: {},
  PT: {},
  RU: {},
  AR: {},
  HI: {},
  TH: {},
  VI: {},
  TR: {},
  NL: {},
  PL: {},
  SV: {},
  NO: {},
  DA: {},
  FI: {},
  EL: {},
  HE: {},
  MS: {},
  UK: {},
  CS: {},
  RO: {},
  HU: {},
  BG: {},
};

export type TranslationKey = keyof typeof translations.EN;
