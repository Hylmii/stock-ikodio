# RTI Business Stock Scraper Service

## Deskripsi
Service ini mengambil data harga saham real-time dari RTI Business (dengan izin resmi). Data diambil dengan melakukan scraping ke halaman saham RTI Business.

## Cara Kerja
- Endpoint RTI: `https://www.rti.co.id/stock/{symbol}`
- Mengambil harga terakhir (`.stock-summary .price`) dan waktu update (`.stock-summary .time`)
- Return: `{ symbol, price, time, source }`

## File Terkait
- `/lib/services/rti-business.service.ts` — Fungsi utama scraping
- `/app/api/rti/quote/route.ts` — API endpoint Next.js

## Contoh Penggunaan API
```
GET /api/rti/quote?symbol=BBCA
```
Response:
```
{
  "success": true,
  "data": {
    "symbol": "BBCA",
    "price": 8750,
    "time": "14:32:10",
    "source": "RTI Business"
  }
}
```

## Catatan
- Selector CSS bisa berubah jika RTI update tampilan, cek dan sesuaikan jika error parsing.
- Hanya gunakan untuk saham yang tersedia di RTI Business.
- Pastikan scraping dilakukan sesuai izin yang diberikan.
