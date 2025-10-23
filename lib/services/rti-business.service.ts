/**
 * RTI Business Stock Scraper
 * Mendapatkan harga saham real-time dari RTI Business (dengan izin)
 *
 * @param symbol Kode saham (misal: BBCA, BBRI, TLKM)
 * @returns { price: number, time: string, ... }
 */
export async function getRTIQuote(symbol: string) {
  const url = `https://www.rti.co.id/stock/${symbol}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; StockBot/1.0)",
    },
    cache: "no-store",
  });
  const html = await res.text();

  // Regex parsing sederhana, sesuaikan dengan struktur HTML RTI terbaru
  // Misal: <div class="price">8.750</div>
  const priceMatch = html.match(
    /<div[^>]*class="price"[^>]*>([\d.,]+)<\/div>/i
  );
  const timeMatch = html.match(/<div[^>]*class="time"[^>]*>([^<]+)<\/div>/i);
  const price = priceMatch
    ? parseFloat(priceMatch[1].replace(/\./g, "").replace(/,/g, "."))
    : NaN;
  const time = timeMatch ? timeMatch[1].trim() : "";

  if (isNaN(price)) throw new Error("Gagal parsing harga saham dari RTI");

  return {
    symbol,
    price,
    time,
    source: "RTI Business",
  };
}
