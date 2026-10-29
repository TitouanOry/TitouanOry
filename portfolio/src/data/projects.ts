/**
 * ============================================================
 *  TES PROJETS — c'est le seul fichier à modifier pour ajouter,
 *  retirer ou réordonner un projet.
 * ============================================================
 *
 *  - L'ordre du tableau = l'ordre dans le bac à disques.
 *  - Les images vont dans  public/projects/<slug>/  et se référencent
 *    avec un chemin qui commence par "/projects/...".
 *  - Le "slug" sert d'URL : /projets/<slug>  (minuscules, tirets, sans accents).
 *  - Les textes peuvent contenir des accents, des emojis, etc.
 */

export type Category = "Réseaux sociaux" | "Design" | "Vidéo" | "Partenariat";

export interface ProjectResult {
  /** Le chiffre mis en avant, ex. "+320 %" ou "1,2 M" */
  value: string;
  /** Ce que le chiffre mesure, ex. "d'abonnés en 6 mois" */
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  category: Category;
  year: number;
  /** Client ou structure (optionnel) */
  client?: string;
  /** Ton rôle sur le projet (optionnel) */
  role?: string;
  /** Image carrée de la "pochette" (idéalement 1200 × 1200) */
  cover: string;
  /** Texte alternatif de la pochette, pour l'accessibilité */
  coverAlt: string;
  /** Une phrase d'accroche affichée sous le titre */
  summary: string;
  context: string;
  objective: string;
  /** Liste de ce que tu as fait (une ligne = une puce) */
  actions: string[];
  results: ProjectResult[];
  /** Images de la galerie (format libre, idéalement 1600 px de large) */
  gallery: string[];
}

// Petit raccourci pour éviter de répéter les chemins des projets fictifs.
// Pour tes vrais projets, tu peux écrire les chemins en entier.
const img = (slug: string, file: string) => `${import.meta.env.BASE_URL}projects/${slug}/${file}`;

export const projects: Project[] = [
  {
    slug: "cap-au-large",
    title: "Cap au large",
    category: "Réseaux sociaux",
    year: 2025,
    client: "École de voile des Minimes",
    role: "Social Media Owner",
    cover: img("cap-au-large", "cover.svg"),
    coverAlt: "Pochette du projet Cap au large : vagues bleues sur fond sable",
    summary: "Refonte complète de la présence Instagram et TikTok d'une école de voile.",
    context:
      "L'école publiait de façon irrégulière, avec des visuels hétérogènes, et peinait à remplir ses stages d'été malgré une très bonne réputation locale.",
    objective:
      "Construire une ligne éditoriale claire et une communauté engagée pour augmenter les inscriptions aux stages de la saison.",
    actions: [
      "Audit des comptes et benchmark de 12 écoles de voile",
      "Ligne éditoriale en 4 piliers : apprendre, vibrer, la vie au club, la mer",
      "Tournage de formats courts en immersion sur l'eau",
      "Calendrier éditorial et templates pour l'équipe",
    ],
    results: [
      { value: "+240 %", label: "d'abonnés Instagram en 6 mois" },
      { value: "1,1 M", label: "vues cumulées sur les Reels" },
      { value: "+35 %", label: "d'inscriptions aux stages d'été" },
    ],
    gallery: [img("cap-au-large", "1.svg"), img("cap-au-large", "2.svg"), img("cap-au-large", "3.svg")],
  },
  {
    slug: "grand-prix-voile",
    title: "Grand Prix Voile",
    category: "Vidéo",
    year: 2025,
    client: "Ligue de voile Nouvelle-Aquitaine",
    role: "Réalisation & montage",
    cover: img("grand-prix-voile", "cover.svg"),
    coverAlt: "Pochette du projet Grand Prix Voile : voile triangulaire orange sur fond marine",
    summary: "Aftermovie et série de clips verticaux pour un week-end de régates.",
    context:
      "Trois jours de compétition, 80 bateaux, et un besoin de contenus à publier en quasi temps réel pendant l'événement.",
    objective: "Faire vivre l'événement en ligne pendant et après les courses, et donner envie de revenir l'an prochain.",
    actions: [
      "Plan de tournage terre / bateau suiveur / drone",
      "Montage de 9 clips verticaux livrés le jour même",
      "Aftermovie de 90 secondes avec sound design",
      "Déclinaisons pour les partenaires de l'événement",
    ],
    results: [
      { value: "480 k", label: "vues sur l'aftermovie" },
      { value: "9", label: "clips publiés pendant l'événement" },
      { value: "x3", label: "d'engagement par rapport à l'édition précédente" },
    ],
    gallery: [img("grand-prix-voile", "1.svg"), img("grand-prix-voile", "2.svg"), img("grand-prix-voile", "3.svg")],
  },
  {
    slug: "riders-du-pertuis",
    title: "Riders du Pertuis",
    category: "Partenariat",
    year: 2024,
    client: "Marque de kitesurf (fictive)",
    role: "Stratégie & gestion des talents",
    cover: img("riders-du-pertuis", "cover.svg"),
    coverAlt: "Pochette du projet Riders du Pertuis : cercles concentriques jaune et vert",
    summary: "Programme d'ambassadeurs réunissant six riders locaux autour d'une marque de kite.",
    context:
      "La marque voulait gagner en crédibilité auprès des pratiquants de la côte atlantique sans passer par des influenceurs généralistes.",
    objective: "Créer un collectif de riders authentiques et produire du contenu réutilisable par la marque.",
    actions: [
      "Sourcing et sélection de 6 riders",
      "Rédaction des contrats et du brief créatif",
      "Coordination de 3 sessions de shooting",
      "Suivi des performances et reporting mensuel",
    ],
    results: [
      { value: "6", label: "riders ambassadeurs" },
      { value: "2,4 M", label: "d'impressions organiques" },
      { value: "+18 %", label: "de ventes sur la région" },
    ],
    gallery: [img("riders-du-pertuis", "1.svg"), img("riders-du-pertuis", "2.svg"), img("riders-du-pertuis", "3.svg")],
  },
  {
    slug: "maree-haute",
    title: "Marée Haute",
    category: "Design",
    year: 2024,
    client: "Surf club associatif",
    role: "Direction artistique",
    cover: img("maree-haute", "cover.svg"),
    coverAlt: "Pochette du projet Marée Haute : bandes horizontales turquoise et crème",
    summary: "Nouvelle identité visuelle pour un surf club : logo, typographies, kit réseaux.",
    context: "Le club utilisait un logo vieillissant et aucun support n'était cohérent d'une saison à l'autre.",
    objective: "Donner au club une identité moderne, simple à utiliser par des bénévoles.",
    actions: [
      "Ateliers avec le bureau et les adhérents",
      "Création du logo et de la palette",
      "Kit de templates Canva pour les réseaux",
      "Déclinaisons textiles et signalétique",
    ],
    results: [
      { value: "40+", label: "templates livrés" },
      { value: "+60 %", label: "de ventes de textile du club" },
      { value: "100 %", label: "des supports harmonisés en une saison" },
    ],
    gallery: [img("maree-haute", "1.svg"), img("maree-haute", "2.svg"), img("maree-haute", "3.svg")],
  },
  {
    slug: "run-the-coast",
    title: "Run the Coast",
    category: "Réseaux sociaux",
    year: 2024,
    client: "Trail côtier (fictif)",
    role: "Stratégie TikTok",
    cover: img("run-the-coast", "cover.svg"),
    coverAlt: "Pochette du projet Run the Coast : lignes diagonales rouges sur fond clair",
    summary: "Lancement d'un compte TikTok pour un trail côtier de 42 km.",
    context: "Une course récente, sans notoriété, face à des trails établis depuis vingt ans.",
    objective: "Faire connaître la course auprès des 20-35 ans et remplir les dossards plus tôt.",
    actions: [
      "Série « 42 km en 42 secondes » de reconnaissance du parcours",
      "Collaborations avec 4 créateurs running",
      "Live le jour de la course",
    ],
    results: [
      { value: "12 k", label: "abonnés TikTok en 4 mois" },
      { value: "-6 sem.", label: "pour atteindre le complet" },
      { value: "7,8 %", label: "de taux d'engagement moyen" },
    ],
    gallery: [img("run-the-coast", "1.svg"), img("run-the-coast", "2.svg"), img("run-the-coast", "3.svg")],
  },
  {
    slug: "atlantic-paddle-series",
    title: "Atlantic Paddle Series",
    category: "Vidéo",
    year: 2023,
    client: "Circuit de stand-up paddle",
    role: "Vidéaste",
    cover: img("atlantic-paddle-series", "cover.svg"),
    coverAlt: "Pochette du projet Atlantic Paddle Series : soleil couchant violet et rose",
    summary: "Série documentaire courte en 4 épisodes sur un circuit de paddle.",
    context: "Le circuit voulait raconter les athlètes plutôt que les résultats.",
    objective: "Créer un format récurrent qui fidélise l'audience entre deux étapes.",
    actions: ["Écriture des épisodes", "Interviews et tournage embarqué", "Montage et étalonnage", "Sous-titrage FR / EN"],
    results: [
      { value: "4", label: "épisodes" },
      { value: "62 %", label: "de taux de complétion moyen" },
      { value: "+9 k", label: "abonnés YouTube" },
    ],
    gallery: [
      img("atlantic-paddle-series", "1.svg"),
      img("atlantic-paddle-series", "2.svg"),
      img("atlantic-paddle-series", "3.svg"),
    ],
  },
  {
    slug: "nautic-live",
    title: "Nautic Live",
    category: "Réseaux sociaux",
    year: 2023,
    client: "Salon nautique (fictif)",
    role: "Community manager",
    cover: img("nautic-live", "cover.svg"),
    coverAlt: "Pochette du projet Nautic Live : grille de points blancs sur fond bleu nuit",
    summary: "Couverture live d'un salon nautique sur Instagram, LinkedIn et X.",
    context: "Dix jours de salon, des centaines d'exposants et une audience à la fois grand public et professionnelle.",
    objective: "Couvrir l'événement en continu et adapter le ton à chaque réseau.",
    actions: [
      "Dispositif de couverture à 3 personnes",
      "Stories quotidiennes et récap du jour",
      "Interviews d'exposants pour LinkedIn",
    ],
    results: [
      { value: "210", label: "contenus publiés en 10 jours" },
      { value: "+5 k", label: "abonnés LinkedIn" },
      { value: "3,2 M", label: "d'impressions" },
    ],
    gallery: [img("nautic-live", "1.svg"), img("nautic-live", "2.svg"), img("nautic-live", "3.svg")],
  },
  {
    slug: "regatta-kit",
    title: "Regatta Kit",
    category: "Design",
    year: 2023,
    client: "Projet personnel",
    role: "Designer",
    cover: img("regatta-kit", "cover.svg"),
    coverAlt: "Pochette du projet Regatta Kit : pavillons géométriques colorés",
    summary: "Kit graphique open source inspiré des pavillons du code international des signaux.",
    context: "Les clubs de voile ont rarement un graphiste, mais beaucoup de besoins visuels.",
    objective: "Proposer un kit gratuit, élégant et facile à prendre en main.",
    actions: ["Dessin de 26 pictogrammes de pavillons", "Templates d'affiches et de résultats", "Mise en ligne et documentation"],
    results: [
      { value: "1 500+", label: "téléchargements" },
      { value: "30+", label: "clubs utilisateurs" },
      { value: "26", label: "pictogrammes" },
    ],
    gallery: [img("regatta-kit", "1.svg"), img("regatta-kit", "2.svg"), img("regatta-kit", "3.svg")],
  },
];

/** Retrouve un projet à partir de son slug (utilisé par la page projet). */
export const getProjectBySlug = (slug: string | undefined) => projects.find((p) => p.slug === slug);
