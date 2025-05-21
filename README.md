

---



### 1. Clone Repository
Clone project ini ke komputer Anda:
```bash
git clone https://github.com/osamahahahah/pretest_chatbot.git

```

### 2. Install Dependencies
Install semua package yang dibutuhkan:
```bash
npm install
```

### 3. Dapatkan API Key OpenRouter
- Daftar/login di [https://openrouter.ai/](https://openrouter.ai/)
- Cari model deepseek/deepseek-chat-v3-0324:free
- Masuk ke dashboard, pilih menu **API**
- Klik **Create Key** lalu copy API key yang muncul

### 4. Buat File `.env`
Buat file `.env` di root folder project, lalu isi dengan:
```
OPENROUTER_API_KEY=masukkan_api_key_anda_disini
```

### 5. Jalankan Server
```bash
npm start
# atau
node server.js
```

### 6. Akses Chatbot
Buka browser dan akses [http://localhost:3001](http://localhost:3001)

---


```

---

## ℹ️ Catatan
- File `.env` **tidak ikut ter-push ke GitHub**. Anda harus membuat dan mengisi sendiri.
- Model AI yang digunakan gratis, namun setiap user wajib punya API key sendiri (proses daftar & ambil key gratis dan cepat).


---

