# Configurare Environment Variables în Vercel

## 🔧 Trebuie să adăugați manual în Vercel Dashboard:

### Pasul 1: Mergeți în Vercel Dashboard
1. Accesați: https://vercel.com/dashboard
2. Selectați proiectul: **trusthire**
3. Mergeți la: **Settings** → **Environment Variables**

### Pasul 2: Adăugați Environment Variables

#### 1. DATABASE_URL
```
Nume: DATABASE_URL
Valoare: libsql://database-champagne-anchor-vercel-icfg-h5bmvex1k5x9icowny1rcosm.aws-eu-west-1.turso.io
Environments: Production, Preview, Development
```

#### 2. VIRUSTOTAL_API_KEY
```
Nume: VIRUSTOTAL_API_KEY
Valoare: 551e3b99515d5307c9f408ecb280afed581d4ab997dd47684adaf0c282173d53
Environments: Production, Preview, Development
```

#### 3. NEXT_PUBLIC_APP_URL
```
Nume: NEXT_PUBLIC_APP_URL
Valoare: https://trusthire.vercel.app
Environments: Production, Preview, Development
```

### Pasul 3: Salvați și Re-deploy
1. Click pe **"Save"**
2. Așteptați 1-2 minute
3. Rulați din nou: `vercel --prod`

## 🎯 După configurare:
- ✅ Baza de date Turso va fi conectată
- ✅ VirusTotal API va funcționa
- ✅ Deploy-ul va reuși

## 🔗 Link direct Vercel:
https://vercel.com/dashboard
