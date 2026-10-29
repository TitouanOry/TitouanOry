/**
 * Tes informations personnelles (en-tête, À propos, Contact).
 * Modifie librement les textes ici.
 */
export const profile = {
  name: "Titouan Ory",
  role: "Social Media Owner",
  tagline: "Créatif sport & nautisme",
  location: "La Rochelle, France",

  bio: [
    "Je raconte le sport et la mer sur les réseaux sociaux. Entre stratégie éditoriale, tournage sur l'eau et partenariats avec des athlètes, je cherche toujours le format qui donne envie d'y aller.",
    "Étudiant en Master Communication digitale et stratégie d'influence à Excelia (La Rochelle), je m'intéresse particulièrement à la façon dont l'IA et les outils numériques transforment la création de contenu.",
  ],

  skills: [
    { group: "Stratégie", items: ["Ligne éditoriale", "Stratégie d'influence", "Partenariats & ambassadeurs", "Reporting & analytics"] },
    { group: "Création", items: ["Tournage & montage vidéo", "Formats courts verticaux", "Direction artistique", "Motion design simple"] },
    { group: "Outils", items: ["Adobe Premiere Pro", "Canva", "Figma", "Notion", "Outils d'IA générative"] },
  ],

  // Parcours : du plus récent au plus ancien
  timeline: [
    { period: "2025 —", title: "Master Communication digitale & stratégie d'influence", place: "Excelia, La Rochelle" },
    { period: "2024 — 2025", title: "Social Media Owner (alternance)", place: "Structure nautique — à compléter" },
    { period: "2023", title: "Stage communication & contenus", place: "Événement sportif — à compléter" },
  ],

  contact: {
    email: "hello@exemple.fr", // ← remplace par ton adresse
    linkedin: "https://www.linkedin.com/", // ← remplace par l'URL de ton profil
    instagram: "https://www.instagram.com/", // ← remplace par l'URL de ton compte
    instagramHandle: "@titouanory", // ← à vérifier
  },
};
