# Portfolio — Titouan Ory

Site portfolio minimaliste dont l'accueil est un **bac à disques** : les projets sont des pochettes de vinyles empilées en diagonale et en 3D, qu'on feuillette à la molette, au drag, au swipe ou au clavier.

Stack : Vite · React · TypeScript · Tailwind CSS v4 · Framer Motion · React Router (sans Three.js : tout est en CSS 3D).

## Lancer le projet

```bash
cd portfolio
npm install
npm run dev        # http://localhost:5173
npm run build      # version de production dans dist/
npm run preview    # tester la version de production
```

## Ajouter / modifier un projet

Tout se passe dans **`src/data/projects.ts`**, sans toucher au reste du code.

1. Crée un dossier `public/projects/mon-projet/` et mets-y tes images.
2. Ajoute un bloc dans le tableau `projects` :

```ts
{
  slug: "mon-projet",                 // URL : /projets/mon-projet (minuscules, tirets, sans accents)
  title: "Mon projet",
  category: "Vidéo",                  // "Réseaux sociaux" | "Design" | "Vidéo" | "Partenariat"
  year: 2025,
  client: "Nom du client",            // optionnel
  role: "Mon rôle",                   // optionnel
  cover: "/projects/mon-projet/cover.webp",   // image carrée
  coverAlt: "Description de l'image",
  summary: "Une phrase d'accroche.",
  context: "…",
  objective: "…",
  actions: ["Ce que j'ai fait 1", "Ce que j'ai fait 2"],
  results: [{ value: "+120 %", label: "d'engagement" }],
  gallery: ["/projects/mon-projet/1.webp", "/projects/mon-projet/2.webp"],
},
```

- **L'ordre du tableau = l'ordre dans le bac.** Déplace un bloc pour réordonner.
- Pour **ajouter une catégorie**, ajoute-la au type `Category` en haut du fichier.
- Supprimer un projet = supprimer son bloc (et son dossier d'images).

### Optimiser tes photos

1. Dépose tes originaux dans `images-src/<slug>/` (ex. `images-src/mon-projet/cover.jpg`). Ce dossier n'est pas versionné.
2. `npm run images` → crée `public/projects/<slug>/cover.webp` (1600 px) et `cover-800.webp` (800 px).
3. Référence le `.webp` dans `projects.ts` : la version 800 px est servie automatiquement aux mobiles.

Les placeholders SVG actuels viennent de `npm run placeholders` : supprime leurs dossiers quand tu as tes vraies images.

### Tes infos perso

`src/data/profile.ts` : nom, rôle, bio, compétences, parcours, email, LinkedIn, Instagram.

### Couleur d'accent

Une seule ligne dans `src/index.css` : `--color-accent: #ff5a1f;`.

### Régler le bac

`src/components/crate/crateMath.ts` contient toute la géométrie (espacement, inclinaison, profondeur, taille desktop/mobile). Les sensibilités de la molette et du drag sont en haut de `useCrateControls.ts`.

## Déployer

**Vercel** : importe le dépôt GitHub, règle *Root Directory* sur `portfolio`. Le framework Vite est détecté automatiquement ; `vercel.json` gère les routes.

**Netlify** : importe le dépôt GitHub. Le fichier `netlify.toml` à la racine du dépôt configure déjà le dossier, la commande et les redirections.
