# 🏁 Notice d'Emploi Complète : Mise en Ligne du Site FFCS

Ce guide détaille pas à pas la mise en production de la plateforme de la **Fédération Française des Conducteurs Sportifs (FFCS)** pour obtenir un site accessible 24h/24 sur Internet, sécurisé en HTTPS, avec nom de domaine personnalisé si souhaité, et **sans aucune erreur**.

---

## 📋 Sommaire
1. [Architecture et Prérequis](#1-architecture-et-prérequis)
2. [Méthode N°1 (Recommandée) : Déploiement Gratuit sur Render.com en 5 minutes](#2-méthode-n1-recommandée--déploiement-gratuit-sur-rendercom)
3. [Méthode N°2 : Déploiement sur Railway.app](#3-méthode-n2--déploiement-sur-railwayapp)
4. [Méthode N°3 : Déploiement Professionnel sur VPS (OVH / Hostinger / Scaleway)](#4-méthode-n3--déploiement-professionnel-sur-vps-linux-ubuntu)
5. [Méthode N°4 : Déploiement via Docker](#5-méthode-n4--déploiement-via-docker)
6. [Associer votre propre Nom de Domaine (ex: www.ffcs.fr)](#6-associer-votre-propre-nom-de-domaine)
7. [Checklist Finale Avant Lancement Public](#7-checklist-finale-avant-lancement-public)

---

## 1. Architecture et Prérequis

Le projet FFCS est conçu selon une architecture **Full-Stack unifiée** :
* **Backend :** Serveur Node.js / Express (`server/index.js`).
* **Frontend :** Application React moderne (Vite, Tailwind CSS, Lucide Icons).
* **Persistance :** Stockage sécurisé des fiches adhérents et épreuves dans `server/data/store.json`.
* **Distribution en production :** Le serveur Express distribue à la fois les routes API (`/api/...`) et les fichiers statiques compilés du frontend (`dist/`), ce qui élimine tout conflit CORS et simplifie l'hébergement en **un seul service**.

### Commandes clés :
* `npm install` : Installe toutes les dépendances.
* `npm run build` : Compile le frontend Vite dans le dossier `dist/`.
* `npm start` : Démarre le serveur de production sur le port défini par la variable d'environnement `PORT` (ou 3001 par défaut).

---

## 2. Méthode N°1 (Recommandée) : Déploiement Gratuit sur Render.com

Render est la plateforme cloud la plus simple pour héberger une application Node.js full-stack avec certificat SSL HTTPS gratuit et renouvellement automatique.

### Étape 2.1 : Publier le code sur GitHub
1. Si vous n'avez pas de compte GitHub, créez-en un sur [github.com](https://github.com).
2. Créez un nouveau dépôt privé ou public nommé `ffcs-association`.
3. Dans votre terminal dans le dossier du projet (`C:\Users\Colib\.gemini\antigravity\scratch\ffcs-association`), exécutez :
   ```bash
   git init
   git add .
   git commit -m "Version officielle FFCS prête pour la production"
   git branch -M main
   git remote add origin https://github.com/VOTRE_PSEUDO/ffcs-association.git
   git push -u origin main
   ```

### Étape 2.2 : Connecter Render
1. Rendez-vous sur [render.com](https://render.com) et créez un compte gratuit (ou connectez-vous avec GitHub).
2. Cliquez sur le bouton bleu **« New + »** en haut à droite, puis sélectionnez **« Web Service »**.
3. Choisissez **« Build and deploy from a Git repository »** et sélectionnez votre dépôt `ffcs-association`.

### Étape 2.3 : Configurer le service
Remplissez les champs de configuration exactement comme suit :
* **Name :** `ffcs-association` (ou le nom de votre choix)
* **Region :** `Frankfurt (EU Central)` *(pour une vitesse maximale en France)*
* **Branch :** `main`
* **Root Directory :** *(laisser vide)*
* **Runtime :** `Node`
* **Build Command :** `npm install && npm run build`
* **Start Command :** `npm start`
* **Instance Type :** `Free` (Gratuit)

### Étape 2.4 : Définir les variables d'environnement
Descendez jusqu'à la section **« Environment Variables »** et ajoutez :
* `NODE_ENV` = `production`
* `JWT_SECRET` = `votre_cle_secrete_ultra_robuste_ffcs_2026` *(mettez une chaîne de caractères aléatoire et complexe)*

### Étape 2.5 : Lancer le déploiement
* Cliquez sur **« Deploy Web Service »**.
* Render installe les dépendances, compile le site avec Vite et lance le serveur Express.
* En 2 à 3 minutes, votre site est en ligne avec une URL sécurisée du type `https://ffcs-association.onrender.com`.

---

## 3. Méthode N°2 : Déploiement sur Railway.app

Railway est une alternative très rapide avec disque persistant si vous souhaitez conserver les modifications du fichier `store.json` lors des redémarrages.

1. Créez un compte sur [railway.app](https://railway.app).
2. Cliquez sur **« New Project »** > **« Deploy from GitHub repo »**.
3. Sélectionnez le dépôt `ffcs-association`.
4. Dans **Settings** du projet :
   * **Build Command :** `npm install && npm run build`
   * **Start Command :** `npm start`
5. Dans l'onglet **Variables**, ajoutez `JWT_SECRET` et `NODE_ENV=production`.
6. Dans **Settings** > **Networking**, cliquez sur **« Generate Domain »** pour obtenir immédiatement votre adresse HTTPS.

---

## 4. Méthode N°3 : Déploiement Professionnel sur VPS Linux (Ubuntu / Debian)

Idéal pour les associations disposant d'un serveur dédié ou VPS (ex: OVH Kimsufi, Hostinger, Scaleway à 3-5€/mois).

### Étape 4.1 : Installer Node.js et PM2 sur le serveur
Connectez-vous à votre serveur en SSH :
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm install -g pm2
```

### Étape 4.2 : Cloner et préparer l'application
```bash
cd /var/www
sudo git clone https://github.com/VOTRE_PSEUDO/ffcs-association.git
cd ffcs-association
sudo npm install
sudo npm run build
```

### Étape 4.3 : Lancer l'application avec PM2 (Démarrage permanent & redémarrage automatique)
```bash
pm2 start server/index.js --name "ffcs-site"
pm2 save
pm2 startup
```

### Étape 4.4 : Configurer Nginx en Proxy Inverse
Créez le fichier de configuration Nginx :
```bash
sudo nano /etc/nginx/sites-available/ffcs
```
Collez la configuration suivante (remplacez `votre-domaine.fr` par votre domaine ou IP) :
```nginx
server {
    listen 80;
    server_name votre-domaine.fr www.votre-domaine.fr;

    client_max_body_size 15M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Activez le site et relancez Nginx :
```bash
sudo ln -s /etc/nginx/sites-available/ffcs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Étape 4.5 : Activer le cadenas HTTPS gratuit (Certbot SSL Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.fr -d www.votre-domaine.fr
```
Certbot configurera automatiquement le certificat SSL renouvelable gratuitement tous les 90 jours.

---

## 5. Méthode N°4 : Déploiement via Docker

Un fichier `Dockerfile` optimisé est déjà inclus dans votre projet.

### Pour construire et lancer l'image :
```bash
# 1. Construction de l'image
docker build -t ffcs-association .

# 2. Exécution du conteneur avec persistance des données
docker run -d \
  -p 3001:3001 \
  -v ffcs_data:/app/server/data \
  -e JWT_SECRET="cle_secrete_ffcs" \
  --name ffcs-web \
  ffcs-association
```
Le site est immédiatement accessible sur `http://votre-ip:3001`.

---

## 6. Associer votre propre Nom de Domaine (ex: ffcs.fr)

Si vous achetez un nom de domaine (chez OVH, Gandi, Namecheap, Hostinger) :

1. Dans la zone DNS de votre registrar :
   * **Pour Render / Railway :**
     * Ajoutez un enregistrement **CNAME** pour `www` pointant vers l'URL fournie par Render (ex: `ffcs-association.onrender.com`).
     * Ajoutez un enregistrement **A** ou **ANAME** pour le domaine racine pointant vers l'adresse IP indiquée dans les paramètres de domaine de Render.
   * **Pour un VPS :**
     * Ajoutez un enregistrement **A** pour `@` pointant vers l'IP de votre VPS.
     * Ajoutez un enregistrement **A** pour `www` pointant vers l'IP de votre VPS.
2. Dans Render : rendez-vous dans les paramètres du service > **« Custom Domains »** > entrez votre domaine. Le certificat SSL s'activera automatiquement en quelques minutes.

---

## 7. Checklist Finale Avant Lancement Public

Avant de communiquer le lien aux adhérents :

- [ ] **Changer les mots de passe par défaut :**
  - Connectez-vous avec le compte Président (`president@ffcs.fr`) et modifiez le mot de passe initial.
  - Vérifiez les comptes Bureau (`vice-president@ffcs.fr`, `secretaire@ffcs.fr`, etc.).
- [ ] **Définir un `JWT_SECRET` robuste :**
  - Assurez-vous que la variable d'environnement `JWT_SECRET` sur votre hébergeur n'utilise pas la clé par défaut de développement.
- [ ] **Créer une première vraie épreuve :**
  - Testez la publication d'une épreuve *Avec Inscription* et d'une épreuve *Juste Informative*.
  - Importez une belle photo d'illustration via le bouton de téléchargement direct.
- [ ] **Tester l'inscription d'un nouvel adhérent :**
  - Rendez-vous sur la page `/register`, créez un compte test libre, ajoutez une photo de profil et inscrivez-vous à une épreuve.
- [ ] **Vérifier l'affichage Mobile :**
  - Le site est entièrement responsive (menu burger, cartes tactiles, licences adaptées aux écrans smartphone).

---
*La plateforme FFCS est désormais parée pour la compétition et prête à accueillir ses adhérents !*
