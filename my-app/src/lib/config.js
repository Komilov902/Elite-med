/* Editable site settings. Leave a value empty to hide the matching block. */

export const SITE = {
  // Working hours in Asia/Tashkent time. Keys are weekdays: 0 = Sunday … 6 = Saturday.
  // `null` means a day off.
  schedule: { 0: null, 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 18] },
  timeZone: "Asia/Tashkent",

  // Social links — fill in to show them in the footer.
  social: {
    telegram: "", // e.g. "https://t.me/elitemed"
    instagram: "", // e.g. "https://instagram.com/elitemed"
    facebook: "",
  },

  // Google Maps embed. In Google Maps: Share → Embed a map → copy the src="…" URL.
  mapEmbed: import.meta.env.VITE_MAP_EMBED_URL || "",

  // Photos for the gallery section, e.g. put files in /public/gallery and list them here:
  // { src: "/gallery/reception.jpg", alt: { uz: "Qabul xonasi", ru: "Приёмная" } }
  gallery: [],
};
