# Excel Upload Manager

Next.js aplikacija za upravljanje Excel podacima sa kompletnim CRUD funkcionalnostima.

## 📋 Funkcionalnosti

- 📤 **Upload Excel fajlova** - Drag & drop ili file picker
- 📋 **Pregled podataka** - Tabelarni prikaz sa paginacijom
- 🔍 **Pretraga i filtriranje** - Opšta pretraga ili specifični filteri
- ➕ **Kreiranje novih redova** - Modal forma za unos
- ✏️ **Ažuriranje redova** - Editovanje postojećih podataka
- 🗑️ **Brisanje redova** - Individualno ili masovno brisanje
- 📥 **Export u XML** - Preuzimanje podataka u XML formatu

## 🚀 Pokretanje

### Instalacija dependency-ja

```bash
npm install
```

### Development server

```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:3000`

### Build za produkciju

```bash
npm run build
```

### Start produkcijskog servera

```bash
npm start
```

### Lint provera

```bash
npm run lint
```

## 🔧 Tehnologije

- **Next.js 14** - React framework sa App Router
- **TypeScript** - Tipizacija
- **Tailwind CSS** - Stilizovanje
- **Axios** - HTTP klijent

## 🌐 API Endpoint

**Backend lokacija:** `AnanasAPI/back` folder

**⚠️ VAŽNO:** Aplikacija MORA da koristi `/api/excel` endpoint za sve API pozive.

**Ispravno:**
```
https://ananas-api-back.onrender.com/api/excel?page=0&size=20
```

**Pogrešno:**
```
https://ananas-api-back.onrender.com/?page=0&size=20
```

**Lokalno razvojno okruženje:**
```
http://localhost:8080/api/excel
```

**Produkcija (Render):**
```
https://ananas-api-back.onrender.com/api/excel
```

**Napomena:** 
- Backend na Render-u koristi port 10000 interno, ali je dostupan preko HTTPS standardnog porta (443)
- Root endpoint (`/`) vraća informacije o API-ju, ali **podaci se dobijaju preko `/api/excel`**
- Frontend automatski dodaje `/api/excel` putanju ako nije prisutna u URL-u

### Environment Variables

Možete podesiti API URL preko environment variable:

Kreirati `.env.local` fajl u root folderu:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/excel
```

Za produkciju:
```env
NEXT_PUBLIC_API_URL=https://ananas-api-back.onrender.com/api/excel
```

**⚠️ Važno:** Aplikacija NE koristi `/api/ananas/excel` endpoint.

**📌 Napomena:** Ako dobijate `ERR_CONNECTION_REFUSED` grešku, proverite da li je backend server pokrenut na `http://localhost:8080`.

## 📁 Struktura Projekta

```
app/
├── components/          # React komponente (Client Components)
│   ├── ExcelUpload.tsx # Upload komponenta
│   ├── ExcelTable.tsx  # Tabela sa podacima
│   ├── SearchBar.tsx   # Pretraga i filteri
│   └── ExcelRowForm.tsx # Forma za kreiranje/ažuriranje
├── services/           # API servisi
│   └── api.ts          # HTTP zahtevi
├── types/              # TypeScript tipovi
│   └── index.ts
├── layout.tsx          # Root layout
├── page.tsx            # Glavna stranica (Home)
└── globals.css         # Globalni stilovi
```

## 📊 Format Excel Fajla

Excel fajl treba da ima sledeću strukturu:

- **Kolona A**: Naziv (obavezno)
- **Kolona B**: Vrednost (opciono)
- **Kolona C**: Napomena (opciono)

Prvi red se preskače (header).

### Primer Excel fajla:

| Naziv | Vrednost | Napomena |
|-------|----------|----------|
| Primer 1 | 100 | Prva napomena |
| Primer 2 | 200 | Druga napomena |

## 🔌 API Endpointi

### 1. Upload Excel fajla
**POST** `/api/excel/upload`

### 2. Pregled svih redova (sa paginacijom)
**GET** `/api/excel?page=0&size=20`

### 3. Pregled reda po ID-u
**GET** `/api/excel/{id}`

### 4. Pregled redova po upload ID-u
**GET** `/api/excel/upload/{uploadId}`

### 5. Pretraga (POST)
**POST** `/api/excel/search`

### 6. Pretraga (GET)
**GET** `/api/excel/search?search=tekst&page=0&size=20`

### 7. Kreiranje novog reda
**POST** `/api/excel`

### 8. Ažuriranje reda
**PUT** `/api/excel/{id}`

### 9. Brisanje reda
**DELETE** `/api/excel/{id}`

### 10. Brisanje svih redova
**DELETE** `/api/excel`

### 11. Export kao XML (svi redovi)
**GET** `/api/excel/export/xml?page=0&size=1000`

### 12. Export kao XML (po upload ID-u)
**GET** `/api/excel/export/xml/{uploadId}`

## 🛠️ Razvoj

### Kreiranje nove komponente

Sve komponente koje koriste React hooks (`useState`, `useEffect`, itd.) moraju imati `'use client'` direktivu na vrhu fajla.

Primer:
```tsx
'use client';

import React from 'react';

export default function MyComponent() {
  // ...
}
```

### Dodavanje novog API endpointa

Dodajte novu funkciju u `app/services/api.ts`:

```typescript
export const myNewFunction = async (data: MyType): Promise<MyResponse> => {
  const response = await api.post<MyResponse>('/my-endpoint', data);
  return response.data;
};
```

## 🐛 Rešavanje problema

### Backend server nije dostupan

Ako dobijate `ERR_CONNECTION_REFUSED` grešku:

1. Proverite da li je backend server pokrenut na `http://localhost:8080`
2. Proverite da li je CORS konfigurisan na backend-u
3. Proverite firewall/postavke mreže

### Port je zauzet

Ako port 3000 je zauzet, Next.js će automatski koristiti sledeći slobodan port (3001, 3002, itd.)

## 📝 License

MIT

## 👤 Autor

Excel Upload Manager © 2024

---

Za više informacija o API endpointima, pogledajte dokumentaciju backend servera.
