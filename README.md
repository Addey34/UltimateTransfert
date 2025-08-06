# UltimateTransfert - Application de Transfert de Fichiers (React + Express + MongoDB)

## Description

**UltimateTransfert** est une application permettant aux utilisateurs de téléverser et partager des fichiers de manière sécurisée. L'application est construite avec **React** (Frontend), **Express.js** avec **MongoDB** (Backend). L'authentification des utilisateurs se fait via **Google OAuth** et les fichiers sont stockés dans une base de données MongoDB en utilisant **GridFS**.

Les utilisateurs peuvent uploader, partager et supprimer leurs fichiers. L'application offre une gestion fluide grâce à des composants React et une API REST sécurisée.

## Fonctionnalités

### Côté Client (Frontend)

- **Inscription / Connexion** via Google OAuth.
- **Gestion de l'authentification** via JWT (JSON Web Token).
- **Téléversement de fichiers** avec une limite de taille configurable.
- **Suppressions de fichiers** avec option de suppression.

### Côté Serveur (Backend)

- **Google OAuth** pour l'authentification des utilisateurs.
- **Authentification via JWT** pour sécuriser les routes.
- **Gestion des fichiers** via **GridFS** pour le stockage.
- **Endpoints REST** pour l'upload, la récupération et la suppression des fichiers.
- **Gestion de la durée de validité des fichiers** avec expiration automatique après 24h.

## Architecture du projet

L'architecture suit une approche **full stack** avec **React** pour le frontend et **Express.js** pour le backend, connectés via une API REST. Les données sont stockées dans **MongoDB** et les fichiers sont gérés via **GridFS**.

```bash
/client  # Frontend (React)
  /src
    /components  # Composants réutilisables
    /context  # Contexte d'authentification et de gestion des fichiers
    /hooks  # Hooks React
    /services  # Services pour les API
    /types  # Types TypeScript

/server  # Backend (Express + MongoDB)
  /src
    /controllers  # Contrôleurs pour les fichiers et l'authentification
    /middlewares  # Middleware pour l'authentification et la gestion des erreurs
    /models  # Modèles de données (Utilisateur, Fichier)
    /routes  # Routes de l'API
    /services  # Logique métier pour les fichiers et l'authentification
    /types  # Types TypeScript pour le backend
```

## Technologies utilisées

### Frontend

- **React** pour l'interface utilisateur dynamique.
- **TypeScript** pour une gestion stricte des types.
- **Axios** pour la gestion des requêtes HTTP.
- **TailwindCSS** pour la mise en forme.
- **Vite** comme bundler pour un développement rapide.
- **React Router** pour la gestion de la navigation.

### Backend

- **Express** pour créer une API REST.
- **MongoDB** pour le stockage des fichiers et des utilisateurs.
- **GridFS** pour le stockage des fichiers volumineux.
- **JWT** (JSON Web Token) pour l'authentification sécurisée des utilisateurs.
- **Passport.js** avec Google OAuth pour l'authentification via Google.
- **Multer** pour gérer l'upload des fichiers.
- **dotenv** pour la gestion des variables d'environnement.

### Prérequis

- **Node.js** (version >=14.x)
- **pnpm** (gestionnaire de paquets)
- **MongoDB** (ou une instance MongoDB accessible via une URL de connexion)
- **Google OAuth Client ID et Secret pour l'authentification**

### Étapes d'installation

1.**Clonez le dépôt :**

```bash
git clone https://github.com/Addey34/UltimateTransfert.git
```

2.**Allez dans le répertoire du projet :**

```bash
cd UltimateTransfert
```

3.**Installer les dépendances pour le frontend et le backend :**

```bash
pnpm install
```

4.**Configurez votre environnement :**
Créez un fichier .env à la racine du projet avec les variables suivantes :

```bash
VITE_SERVER_URL=http://localhost:3000
VITE_CLIENT_URL=http://localhost:5173
PORT=3000
MONGO_CONNECT_URL=mongodb://localhost:27017/ultimetransfert
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-secret-key
```

5.**Lancer le frontend et le backend :**

```bash
pnpm run dev
```

Cela va démarrer le serveur backend sur [Backend](http://localhost:3000) et le frontend sur [Frontend](http://localhost:5173).

### Routes API

#### Authentification

- POST /api/auth/google/callback : Callback de Google pour récupérer le token JWT.
- GET /api/auth/user : Récupérer les informations de l'utilisateur connecté.

### Fichiers

- POST /api/files/upload : Téléverser un fichier (authentification requise).
- GET /api/files/user : Récupérer tous les fichiers de l'utilisateur connecté.
- GET /api/files/download/:shareLink : Télécharger un fichier via son lien de partage.
- DELETE /api/files/:fileId : Supprimer un fichier.

#### Sécurisation

- JWT (JSON Web Token) : L'authentification est gérée via des tokens JWT, garantissant que seules les requêtes authentifiées peuvent accéder aux routes protégées.

- CORS : Le CORS est configuré pour permettre uniquement les connexions provenant des origines autorisées définies dans .env.

#### Développement

Scripts

Frontend && Backend :

```bash
pnpm run dev : # Lancer le serveur de développement et le serveur.
pnpm run build : # Construire le projet pour la production.
```

### Contributions

Les contributions sont les bienvenues ! Si vous souhaitez ajouter de nouvelles fonctionnalités ou améliorer l'existant, veuillez soumettre une pull request. Assurez-vous d'expliquer clairement vos modifications dans le message de la PR.

### Licence

Distribué sous la licence MIT. Voir le fichier LICENSE pour plus de détails.
