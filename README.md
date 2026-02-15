# 🐍📓 Py2Nb

**Convertissez vos scripts Python en notebooks Jupyter professionnels et documentés grâce à l'IA**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.0-orange?logo=firebase)](https://firebase.google.com/)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4-purple)](https://www.anthropic.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🎯 À propos

**Py2Nb** est une application SaaS qui transforme vos scripts Python bruts en notebooks Jupyter professionnels avec documentation structurée et explications détaillées. Propulsé par Claude AI (Anthropic), Py2Nb analyse votre code, ajoute des commentaires en markdown avec le format Jupytext, puis génère un fichier `.ipynb` prêt à l'emploi.

**🔗 Application en ligne**: [https://py2nb--py-2-nb.europe-west4.hosted.app](https://py2nb--py-2-nb.europe-west4.hosted.app)

---

## ✨ Fonctionnalités

### 🤖 Conversion Intelligente
- **Analyse IA avancée** : Claude Sonnet 4 analyse votre code et génère une documentation contextuelle
- **Format Jupytext** : Conversion via tags percent-format (`# %% [markdown]` et `# %%`)
- **Structuration automatique** : Sections, titres, explications techniques, exemples d'usage
- **Préservation du code** : Votre code original reste intact, seule la documentation est ajoutée

### 👤 Authentification Flexible
- **Connexion par email/mot de passe** : Inscription classique avec Firebase Auth
- **Connexion Google OAuth** : Authentification en un clic (popup desktop, redirect mobile)
- **Gestion de profil** : Tableau de bord utilisateur avec historique des conversions

### 💳 Modèle Économique Hybride

#### Pour Utilisateurs Non-Connectés (Pay-Per-Use)
- **0.20€** : Scripts < 200 lignes
- **0.50€** : Scripts 200-1000 lignes
- **1.00€** : Scripts > 1000 lignes
- Paiement Stripe sécurisé
- Téléchargement immédiat du notebook

#### Pour Utilisateurs Abonnés
- **Gratuit** : 3 conversions/mois (50 lignes max)
- **Pro** (4.99€/mois) : 50 conversions/mois (2000 lignes max)
- **Premium** (19.99€/mois) : Conversions illimitées (10000 lignes max)

### 🎨 Interface Moderne
- **UI Dark Mode** : Design minimaliste avec Tailwind CSS 4
- **Composants shadcn/ui** : Interface cohérente et accessible
- **Animations Motion** : Transitions fluides (Framer Motion)
- **Responsive** : Optimisé mobile, tablette et desktop
- **Prévisualisation en direct** : Aperçu du notebook avant téléchargement

---

## 🛠️ Stack Technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| **Framework** | Next.js (App Router) | 15.5.x |
| **UI** | React | 19.1.x |
| **Styling** | Tailwind CSS | 4.x |
| **Composants** | shadcn/ui (Radix UI) | latest |
| **Animations** | Motion (Framer Motion) | 12.x |
| **Langage** | TypeScript | 5.9.x |
| **Authentification** | Firebase Auth | firebase 12.x |
| **State Management** | Zustand | 5.x |
| **Base de données** | Firestore | firebase-admin 13.x |
| **Intelligence Artificielle** | Anthropic Claude API | @anthropic-ai/sdk 0.74.x |
| **Paiements** | Stripe | stripe 20.x |
| **Conversion Notebook** | Jupytext (via `uvx`) | 1.19.x |
| **Déploiement** | Firebase App Hosting → Cloud Run | GCP |

---

## 🚀 Installation Locale

### Prérequis

- **Node.js** 18.x ou supérieur
- **npm** ou **pnpm**
- **Python 3.8+** (pour Jupytext)
- **uv** (gestionnaire de paquets Python)
- Compte **Firebase** (Auth + Firestore)
- Clé API **Anthropic Claude**
- Compte **Stripe** (test ou live)

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/berch-t/py2nb.git
   cd py2nb
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   Créer un fichier `.env.local` à la racine:
   ```env
   # Firebase Client (Public)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

   # Firebase Admin (Server-Only)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=service-account@your_project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

   # Anthropic
   ANTHROPIC_API_KEY=sk-ant-api03-...

   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRO_PRICE_ID=price_...
   STRIPE_PREMIUM_PRICE_ID=price_...

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Configurer Firebase**
   - Créer un projet Firebase
   - Activer Authentication (Email + Google)
   - Créer une base Firestore
   - Télécharger les credentials du service account

5. **Configurer Stripe**
   - Créer les produits Pro et Premium dans Stripe Dashboard
   - Récupérer les Price IDs
   - Configurer un webhook pointant vers `/api/stripe/webhook`

6. **Installer uv (pour Jupytext)**
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

7. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

8. **Ouvrir l'application**

   Naviguer vers [http://localhost:3000](http://localhost:3000)

---

## 📦 Déploiement

Le déploiement se fait via **Firebase App Hosting** (Cloud Run).

### Guide Complet

Voir le fichier [`DEPLOYMENT.md`](DEPLOYMENT.md) pour un guide détaillé en 11 phases couvrant:
- Configuration Firebase (Auth, Firestore, App Hosting)
- Configuration GCP (IAM, Secret Manager, Cloud Run)
- Configuration Stripe (webhooks, produits)
- Configuration Anthropic (clé API)
- Tests de bout en bout

### Déploiement Rapide

```bash
# 1. Configurer les secrets dans Cloud Secret Manager (voir DEPLOYMENT.md)

# 2. Créer apphosting.yaml à la racine (déjà fait dans ce repo)

# 3. Déployer via Firebase CLI
npm install -g firebase-tools
firebase login
firebase apphosting:backends:create

# 4. Push sur GitHub → déploiement automatique
git push origin main
```

---

## 🏗️ Architecture

### Pipeline de Conversion

```
1. Client (paste ou upload .py) → POST /api/convert
2. Vérification auth + limites d'usage (Firestore)
3. Appel Claude API avec prompt système optimisé
4. Claude retourne code avec tags Jupytext (# %%, # %% [markdown])
5. Conversion via `uvx jupytext --to notebook input.py -o output.ipynb`
6. Retour JSON .ipynb → client (préview + download)
7. Incrémentation compteur conversions (Firestore)
```

### Collections Firestore

```
users/{uid}
  ├── email, displayName, photoURL
  ├── plan: "free" | "pro" | "premium"
  ├── stripeCustomerId, stripeSubscriptionId
  ├── conversionsUsed, conversionsThisMonth
  └── createdAt, updatedAt

conversions/{conversionId}
  ├── userId (ou null pour pay-per-use)
  ├── inputCode, outputNotebook (JSON)
  ├── claudeTokensUsed, status, duration
  └── createdAt

payments/{paymentId}
  ├── userId, stripeSessionId
  ├── type, plan, amount, status
  └── createdAt

pending_conversions/{pendingId}  // TTL 1h
  ├── code, fileName, lineCount, priceInCents
  ├── status: "pending_payment" | "processing" | "completed"
  └── expiresAt
```

### API Routes

- `POST /api/convert` : Conversion authentifiée (utilisateurs abonnés)
- `POST /api/convert/pay-per-use` : Initie paiement Stripe pour anonymes
- `GET /api/convert/process-payment` : Callback Stripe → conversion
- `POST /api/auth/verify` : Vérification token Firebase server-side
- `POST /api/stripe/checkout` : Création session Stripe (abonnements)
- `POST /api/stripe/webhook` : Traitement événements Stripe
- `GET /api/usage` : Statistiques d'usage utilisateur

---

## 🔒 Sécurité

- **Server-only secrets** : Clés sensibles (Firebase Admin, Stripe) dans Cloud Secret Manager
- **Vérification tokens** : Firebase ID tokens vérifiés server-side via `firebase-admin`
- **Règles Firestore** : Accès strict par UID, collections sensibles server-only
- **Webhook signatures** : Vérification signature Stripe avec `constructEvent()`
- **Rate limiting** : Limites de conversions par plan, anti-abus
- **HTTPS obligatoire** : Toutes les requêtes en HTTPS (Cloud Run)
- **CORS configuré** : Headers COOP pour auth popup Google
- **Validation inputs** : Sanitization côté serveur (longueur code, format fichier)

---

## 📝 Utilisation

### Conversion Simple (Non-Connecté)

1. Coller votre code Python ou uploader un fichier `.py`
2. Voir le prix estimé (0.20€, 0.50€, ou 1.00€)
3. Cliquer sur **"Convertir"**
4. Payer via Stripe Checkout
5. Téléchargement automatique du `.ipynb`

### Conversion Abonnée

1. **S'inscrire** (email ou Google)
2. **Souscrire** à un plan (Gratuit, Pro, ou Premium)
3. **Coller/uploader** votre code Python
4. **Convertir** gratuitement (selon limites du plan)
5. **Prévisualiser** le notebook généré
6. **Télécharger** le fichier `.ipynb`

### Dashboard

- Voir l'historique des conversions
- Consulter l'usage du mois en cours
- Gérer l'abonnement Stripe (upgrade, cancel)
- Télécharger à nouveau d'anciennes conversions

---

## 🧪 Tests

### Test Unitaire de Conversion

```bash
# Créer un fichier Python de test
echo 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df.head())' > test.py

# Tester jupytext localement
uvx jupytext --to notebook test.py -o test.ipynb

# Vérifier le résultat
cat test.ipynb
```

### Test E2E

Voir les 8 scénarios de test dans [`DEPLOYMENT.md`](DEPLOYMENT.md) section 8.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer:

1. **Fork** le projet
2. **Créer une branche** (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Committer** vos changements (`git commit -m 'Add: nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir une Pull Request**

### Conventions de Code

- **ESLint**: Config flat (`eslint.config.mjs`)
- **TypeScript**: Mode strict activé
- **Prettier**: Formatage automatique
- **Commits conventionnels**: `feat:`, `fix:`, `docs:`, `refactor:`, etc.

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📧 Contact & Support

- **Issues GitHub**: [github.com/berch-t/py2nb/issues](https://github.com/berch-t/py2nb/issues)
- **Email**: support@py2nb.com
- **Documentation**: Voir [`DEPLOYMENT.md`](DEPLOYMENT.md) et [`PAY_PER_USE.md`](PAY_PER_USE.md)

---

## 🙏 Remerciements

- [Anthropic](https://www.anthropic.com/) pour l'API Claude
- [Firebase](https://firebase.google.com/) pour l'infrastructure backend
- [Stripe](https://stripe.com/) pour le système de paiement
- [Jupytext](https://jupytext.readthedocs.io/) pour la conversion notebook
- [shadcn/ui](https://ui.shadcn.com/) pour les composants UI
- [Vercel](https://vercel.com/) pour l'inspiration Next.js

---

<div align="center">

**Fait avec ❤️ et ☕ par [Berch-T](https://github.com/berch-t)**

⭐ **N'oubliez pas de mettre une étoile si ce projet vous est utile !**

</div>
