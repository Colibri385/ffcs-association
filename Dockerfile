# Étape 1 : Environnement Node.js LTS
FROM node:20-alpine

# Répertoire de travail
WORKDIR /app

# Copie des manifestes de dépendances
COPY package*.json ./

# Installation propre des dépendances
RUN npm ci --omit=dev || npm install

# Copie de l'intégralité du code source
COPY . .

# Construction du bundle frontend de production (Vite)
RUN npx vite build

# Exposition du port (3001 par défaut ou via PORT)
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001

# Démarrage du serveur full-stack Express
CMD ["npm", "start"]
