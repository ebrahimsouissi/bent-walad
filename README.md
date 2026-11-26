# Bent w Walad 🇹🇳

Jeu tounsi "Bent w Walad" (Petit Bac), multijoueur en temps réel.
Node.js + Express + Socket.IO. Bla base de données: les salles y3ichou fel mémoire mta3 el serveur.

## Tal3eb 3al PC mta3ek (local)

1. Installi **Node.js 18+** : https://nodejs.org
2. F'dossier el projet:
   ```bash
   npm install
   npm start
   ```
3. 7el **http://localhost:3000** fel navigateur.
4. Bech tal3eb m3a 7ad 3al nafs el wifi: ab3athlou `http://<IP-mta3-PC-ek>:3000`
   (Windows: `ipconfig` → "Adresse IPv4").

## T7ottou en ligne b'blech (Render)

1. A3mel compte **GitHub** w 7ott el dossier hedha fi repo jdid (bla `node_modules`).
2. A3mel compte **https://render.com** → **New → Web Service** → ekhtar el repo.
3. Réglages:
   - Runtime: **Node**
   - Build command: `npm install`
   - Start command: `npm start`
   - Instance type: **Free**
4. Ba3d 2–3 minutes ya3tik lien kima `https://bent-w-walad.onrender.com`. Ab3ath el lien l's7abek w al3bou.

> Fel version gratuite, Render yr9od el serveur ba3d 15 min bla 7ad. Awel wa7ed y7el el lien yestanna ~30 s, w ba3d yemchi normal.
> Alternatives: Railway, Fly.io, Koyeb (lkol ya9blou Node + WebSocket).

## Kifech tetla3eb

- Wa7ed ya3mel **salle** (howa el host ★), ya3ti el lien wela el code l'les autres.
- El host yekhtar les cases (3 au minimum) w el wa9t, w yenzel "Ebda el partie".
- Kol round yo5rej 7arf. Elli ykammel el cases lkol ynajem yenzel **STOP**, wela el wa9t youfa.
- Score: kelma s7i7a w wa7dek **10**, kelma ktebha 7ad ekher **5**, fergha/ghalta **0**.
- El host ynajem yenzel 3la kelma fel tableau bech yrefuseha.
- Ken el host yo5rej, joueur ekher ywalli host automatiquement.

## Structure

```
server.js          logique el jeu (salles, rounds, STOP, score)
public/index.html  l'page
public/app.js      el client (affichage + Socket.IO)
```

## Idées bech tzid

- Base de données (SQLite/Supabase) bech tsauvegardi les scores.
- Mode "vote": les joueurs lkol yvotiw 3al kelmet mouch ken el host.
- Dictionnaire bech yverifi el kelmet automatiquement.
