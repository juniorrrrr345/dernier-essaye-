# 🌿 Boutique CBD - Application E-commerce Moderne

Une boutique en ligne moderne et responsive pour la vente de produits CBD, développée avec Next.js 14, TypeScript et Tailwind CSS.

## ✨ Fonctionnalités

### 🛍️ Boutique Frontend
- **Page d'accueil moderne** avec présentation de la boutique
- **Catalogue de produits** avec miniatures vidéo générées automatiquement
- **Pages détail produit** avec vidéo complète et description
- **Recherche et filtrage** des produits
- **Design responsive** optimisé mobile et desktop
- **Mode sombre/clair** configurable
- **Fond personnalisable** (couleur ou image)
- **Page réseaux sociaux** avec liens externes

### 🔐 Panel d'Administration
- **Authentification sécurisée** par mot de passe
- **Gestion complète des produits** (CRUD)
- **Upload de vidéos** avec génération automatique de miniatures
- **Configuration de la boutique** (nom, thème, footer)
- **Gestion des réseaux sociaux**
- **Personnalisation du design**

### 🎥 Gestion Vidéo Avancée
- **Upload automatique** vers Cloudinary
- **Génération de miniatures** à partir des vidéos
- **Optimisation automatique** de la qualité
- **Support multi-formats** (MP4, WebM, etc.)

## 🚀 Technologies Utilisées

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Base de données**: Supabase (PostgreSQL)
- **Stockage vidéo**: Cloudinary
- **Authentification**: JWT + bcrypt
- **Déploiement**: Vercel

## 📦 Installation et Configuration

### 1. Cloner le projet

```bash
git clone [URL_DU_REPO]
cd cbd-boutique
npm install
```

### 2. Configuration de l'environnement

Copiez le fichier `.env.local` et configurez vos variables :

```bash
cp .env.local.example .env.local
```

### 3. Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Copiez l'URL et la clé API anonyme dans `.env.local`
3. Exécutez le SQL d'initialisation dans l'éditeur SQL de Supabase :

```sql
-- Copiez le contenu de src/lib/supabase.ts (section initTables)
```

### 4. Configuration Cloudinary

1. Créez un compte sur [Cloudinary](https://cloudinary.com)
2. Récupérez vos credentials dans le dashboard
3. Ajoutez-les dans `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### 5. Configuration du mot de passe administrateur

Générez le hash du mot de passe admin :

```bash
node scripts/generate-admin-password.js
```

Copiez le hash généré dans `.env.local`:

```env
ADMIN_PASSWORD_HASH=le_hash_généré
JWT_SECRET=votre_secret_jwt_securise
```

### 6. Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🌐 Déploiement sur Vercel

### 1. Préparation du repository

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Déploiement

1. Connectez-vous sur [Vercel](https://vercel.com)
2. Importez votre repository GitHub
3. Configurez les variables d'environnement dans les settings Vercel
4. Déployez automatiquement

### 3. Variables d'environnement Vercel

Ajoutez toutes les variables de `.env.local` dans les settings Vercel :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ADMIN_PASSWORD_HASH`
- `JWT_SECRET`

## 📖 Guide d'utilisation

### Accès Administration

1. Rendez-vous sur `/admin`
2. Utilisez le mot de passe configuré (par défaut: `admin123`)
3. Accédez au dashboard d'administration

### Gestion des Produits

1. **Ajouter un produit** :
   - Nom, description, prix
   - Upload d'une vidéo (génération automatique de miniature)
   - Lien de commande externe

2. **Modifier un produit** :
   - Édition de tous les champs
   - Remplacement de la vidéo
   - Activation/désactivation

### Configuration de la Boutique

- **Nom de la boutique** : Modifiable dans l'admin
- **Thème** : Mode clair/sombre
- **Fond** : Couleur unie ou image uploadée
- **Footer** : Texte personnalisable

## 📁 Structure du Projet

```
cbd-boutique/
├── src/
│   ├── app/                    # Pages Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── admin/             # Pages admin
│   │   ├── produits/          # Pages produits
│   │   └── globals.css        # Styles globaux
│   ├── components/            # Composants React
│   │   ├── ui/               # Composants UI réutilisables
│   │   └── providers/        # Context providers
│   ├── lib/                  # Utilitaires et configuration
│   └── types/                # Types TypeScript
├── scripts/                  # Scripts utilitaires
└── public/                   # Fichiers statiques
```

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Lancement en développement
npm run build        # Build de production
npm run start        # Démarrage du serveur de production
npm run lint         # Vérification ESLint
```

## 🔧 Personnalisation

### Couleurs et Thème

Modifiez les couleurs dans `src/app/globals.css` et les composants Tailwind.

### Ajout de Fonctionnalités

1. Créez de nouveaux composants dans `src/components/`
2. Ajoutez des API routes dans `src/app/api/`
3. Utilisez TypeScript pour la sécurité des types

## 📱 Responsive Design

L'application est optimisée pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🔒 Sécurité

- **Authentification JWT** pour l'admin
- **Validation des données** côté serveur
- **Protection CSRF** native Next.js
- **Gestion sécurisée des fichiers** avec Cloudinary
- **Variables d'environnement** pour les secrets

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur de connexion Supabase** :
   - Vérifiez les URLs et clés API
   - Contrôlez les policies RLS

2. **Upload vidéo échoue** :
   - Vérifiez les credentials Cloudinary
   - Contrôlez la taille des fichiers (max 100MB)

3. **Authentification admin** :
   - Régénérez le hash du mot de passe
   - Vérifiez la variable JWT_SECRET

### Logs et Debug

```bash
# Logs Vercel
vercel logs

# Debug local
npm run dev
```

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les logs d'erreur
3. Contactez l'équipe de développement

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**🌿 Créé avec ❤️ pour les boutiques CBD modernes**
