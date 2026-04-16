# Configurare Bază de Date PostgreSQL pentru TrustHire

## 📋 Pași necesari:

### 1. Instalați PostgreSQL
```bash
# Windows (cu Chocolatey)
choco install postgresql

# Sau descărcați de pe: https://www.postgresql.org/download/windows/
```

### 2. Creați baza de date
Deschideți pgAdmin sau folosiți command line:
```sql
CREATE DATABASE trusthire;
CREATE USER trusthire_user WITH PASSWORD 'parola_ta_securizata';
GRANT ALL PRIVILEGES ON DATABASE trusthire TO trusthire_user;
```

### 3. Actualizați .env.local
Înlocuiți linia curentă cu datele reale:
```env
# Înlocuiți cu datele voastre
DATABASE_URL="postgresql://trusthire_user:parola_ta_securizata@localhost:5432/trusthire"
```

### 4. Generați Prisma Client
```bash
npx prisma generate
```

### 5. Aplicați migrațiile
```bash
npx prisma db push
```

## 🔒 Securitate:
- Folosiți o parolă puternică
- Nu commitați fișierul .env.local în git
- Folosiți environment variables în producție

## 🚀 După configurare:
- Aplicația va stoca assessment-urile în baza de date
- Veți putea accesa rezultatele mai târziu
- Funcționalitățile complete vor fi active
