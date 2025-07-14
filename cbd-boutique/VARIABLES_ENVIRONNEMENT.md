# Variables d'Environnement pour Vercel

## 🔧 Configuration requise

### 1. Variables Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.votre_cle_service
```

### 2. Variables Cloudinary
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### 3. Variables Admin
```
ADMIN_PASSWORD_HASH=$2b$10$qz8xyCrA7UCnIYkp1TVZKe/Iz0amQoWrbx7S0cIFeBc1zQluBzOvq
JWT_SECRET=votre_secret_jwt_securise_ici
```

## 📋 Étapes de configuration

### Étape 1 : Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez les clés dans Settings → API
4. Exécutez le script SQL dans `supabase-init.sql`

### Étape 2 : Créer un compte Cloudinary
1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Créez un compte gratuit
3. Récupérez les credentials dans le Dashboard

### Étape 3 : Configurer Vercel
1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez toutes les variables ci-dessus

## 🔑 Informations de connexion admin
- **URL admin** : `/admin`
- **Mot de passe** : `admin123`
- **Hash généré** : `$2b$10$qz8xyCrA7UCnIYkp1TVZKe/Iz0amQoWrbx7S0cIFeBc1zQluBzOvq`

⚠️ **Important** : Changez le mot de passe admin en production !