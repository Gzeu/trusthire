# Configurare Bază de Date pe Vercel

## 🗄️ Trebuie să creați baza de date pe Vercel:

### Pasul 1: Mergeți pe Vercel Dashboard
1. Accesați: https://vercel.com/dashboard
2. Selectați proiectul: `trusthire`
3. Mergeți la: **Storage** → **Database**

### Pasul 2: Creați Baza de Date
1. Click pe **"Create Database"**
2. Alegeți **Postgres** (recomandat)
3. Selectați region: **EU** (pentru performanță)
4. Numeți baza de date: `trusthire-db`
5. Click pe **"Create"**

### Pasul 3: Configurați Connection String
După creare, Vercel va afișa:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

### Pasul 4: Adăugați Environment Variables
1. În Vercel Dashboard → Settings → Environment Variables
2. Adăugați:
   - **DATABASE_URL** = (connection string de la pasul 3)
   - **VIRUSTOTAL_API_KEY** = cheia voastră API

### Pasul 5: Re-deploy
```bash
vercel --prod
```

## 🎯 După configurare:
- ✅ Baza de date va fi funcțională
- ✅ Assessment-urile se vor salva
- ✅ Toate funcționalitățile active

## 🔗 Link direct:
https://vercel.com/dashboard
