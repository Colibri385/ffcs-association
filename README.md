# FFCS - Fédération Française des Conducteurs du Sport 🏎️🏁

Plateforme web officielle complète et fonctionnelle pour la gestion de la **Fédération Française des Conducteurs du Sport (FFCS)**.

Aux couleurs sportives nationales **Bleu, Blanc et Rouge**, le site offre une expérience fluide pour la gestion des membres, les inscriptions aux épreuves sportives en temps réel et la gouvernance par le bureau fédéral.

---

## 🌟 Fonctionnalités Clés

### 1. Inscription Libre & Gratuite pour Chaque Membre
- Formulaire d’inscription pour les adhérents avec nom, email, mot de passe, Adhésion, téléphone et palmarès/bio.
- Attribution automatique du rôle officiel de **Membre Régulier** (`regular_member`).
- Génération instantanée d'un numéro de licence officiel fédéral (ex: `FFCS-FR-042`).
- Espace personnel avec licence numérique, statut actif et suivi des épreuves engagées.

### 2. Événements Sportifs & Gestion des Places en Temps Réel
- Consultation du calendrier officiel des épreuves en cours (Track Days, Rallies, Championnats de Karting, Courses de Côte, Stages de Pilotage, SimRacing).
- **Contrôle dynamique des quotas de places :**
  - Jauge en temps réel (`X places disponibles sur Y`).
  - Blocage automatique des inscriptions dès que l’épreuve est complète (`Complet / Sold Out`).
  - Protection contre les doublons d'inscription.
  - Possibilité pour le pilote d'annuler son engagement à tout moment, libérant instantanément une place pour la communauté.
- Fiche détaillée pour chaque épreuve avec tracé, spécifications du circuit, horaires, consignes de sécurité (bruit max, casque FIA, équipement requis).
- Roster officiel des engagés avec nom, véhicule et licence (et coordonnées de contact réservées aux membres du bureau pour la direction de course).

### 3. Composition Officielle du Bureau Fédéral
- Page dédiée présentant l'équipe exécutive du Bureau Directeur :
  - **Président Fédéral** (`president`)
  - **Vice-Présidente** (`vice_president`)
  - **Secrétaire Général** (`secretary`)
  - **Trésorière Générale** (`treasurer`)
  - **Membres du Bureau** (`board_member`)
- Fiches de présentation avec portrait, titre statutaire, pôle d'intervention, mandat en cours et missions fédérales.

### 4. Rôles et Autorisations : Modifications Réservées au Bureau
- **Rôles supportés :**
  1. `regular_member` (Membre régulier / Pilote adhérent)
  2. `president` (Président)
  3. `vice_president` (Vice-Président)
  4. `secretary` (Secrétaire)
  5. `treasurer` (Trésorier)
  6. `board_member` (Membre du Bureau)
- **Règle de sécurité stricte :** *« Les modifications sur le site ne peuvent être effectuées que par un membre du bureau. »*
  - Seuls les membres du bureau ont accès à la création, modification et suppression d'épreuves sportives.
  - Seuls les membres du bureau peuvent modifier la composition et les fiches du bureau.
  - Seuls les membres du bureau peuvent accéder au portale d'administration pour réassigner ou promouvoir le rôle d'un adhérent.
  - Garde-fou intégré interdisant la destitution du dernier Président actif.

### 5. Sélecteur Démo 1-Clic Intégré
Pour faciliter vos tests immédiats sans avoir à ressaisir des mots de passe :
- Un menu déroulant **« Tester un rôle »** présent dans la barre de navigation permet de basculer instantanément entre le Président, la Trésorière, le Secrétaire, le Membre du Bureau ou le Membre Régulier.

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement en mode développement (API Backend + Frontend Vite)
```bash
npm run dev
```
- Frontend : `http://localhost:5173`
- Backend API : `http://localhost:3001`

### 3. Build de production
```bash
npm run build
```

---

## 🔑 Comptes de Démonstration Pré-configurés

| Rôle | Nom | Email | Mot de passe | Privilèges |
|---|---|---|---|---|
| **Président** | Pierre de Courcelles | `president@ffcs.fr` | `President2026!` | Modification complète du site, bureau, épreuves et rôles |
| **Vice-Présidente** | Éléonore Vasseur | `vice-president@ffcs.fr` | `VicePres2026!` | Membre du bureau, gestion des épreuves et partenariats |
| **Secrétaire** | Marc Fontaine | `secretaire@ffcs.fr` | `Secretaire2026!` | Membre du bureau, suivi administratif des licences |
| **Trésorière** | Sophie Laurent | `tresorier@ffcs.fr` | `Tresorier2026!` | Membre du bureau, validation budgétaire des épreuves |
| **Membre Bureau** | Julien Rossi | `bureau@ffcs.fr` | `Bureau2026!` | Membre du bureau, direction technique et sécurité |
| **Membre Régulier** | Lucas Moreau | `pilote@ffcs.fr` | `Pilote2026!` | Inscription libre aux épreuves avec places disponibles |

---

## 🎨 Palette Graphique

- **Bleu Fédéral :** `#123B70` / `#1D4ED8` (vitesse, autorité institutionnelle, précision technique)
- **Blanc Pur :** `#FFFFFF` (clarté, drapeaux de départ, contrastes lumineux)
- **Rouge Compétition :** `#DC2626` / `#EF4444` (passion automobile, vibreurs de circuit, dynamisme)
- **Carbone & Nuit :** `#0B1120` / `#131D31` (matériaux composites, ambiance nocturne paddock)
