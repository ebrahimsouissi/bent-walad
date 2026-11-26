# Bent w Walad 🇹🇳

Jeu tounsi "Bent w Walad" (Petit Bac), multijoueur en temps réel, en **français** wela bel **3arbiya el fos7a**.
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

- Kol joueur yekhtar logha mta3 l'page (bouton **العربية / Français**).
- Wa7ed ya3mel **salle** (howa el host ★), ya3ti el lien wela el code l'les autres.
- El host yekhtar **logha mta3 el ijabet** (7orouf latin wela 3arbiya), les cases (3 au minimum) w el wa9t.
- Kol round yo5rej 7arf. Elli ykammel el cases lkol ynajem yenzel **STOP**, wela el wa9t youfa.
- Ba3d el STOP, **kol joueur ychateb** el kelmet el ghaltin mta3 les autres. Kelma tetchateb ki akther men nos les autres joueurs ychatbouha.
- Ki l'kol yenzlou "J'ai fini / انتهيت", el score yet7seb ken 3al kelmet elli mouch mchatbin: **10** kelma wa7dek, **5** ki ktebha 7ad ekher, **0** fergha/ghalta/mchatba.
- Fel natija, **ken el host ynajem ybaddel el ni9at** mta3 ay kelma b'− w + (7atta bel 7arf el ghalet). ↺ traja3 el 7seb automatique. Les autres ychoufou el ni9at w "✎ modifié par …".
- Kelma **bel 7arf el ghalet** tetchateb automatiquement (0). El host ynajem yenzel **"Accepter / اقبلها"** bech ya9belha, w ↺ bech yraja3ha.
- El bouton **STOP** louta, ta7t el cases.
- Bel 3arbi: el tachkil ma yet7sebch, أ/إ/آ = ا, w "ال" fel bidaya ma tet7sebch (البرتقال mrigla l'7arf ب).
- Ken el host yo5rej, joueur ekher ywalli host automatiquement.

## Structure

```
server.js          logique el jeu (salles, rounds, STOP, score)
public/index.html  l'page
public/app.js      el client (affichage + Socket.IO)
```

## Idées bech tzid

- Base de données (SQLite/Supabase) bech tsauvegardi les scores.
- Dictionnaire bech yverifi el kelmet automatiquement.
