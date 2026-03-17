export const siteConfig = {
  title: "Asian Foods Daily",
  description: "Discover authentic Asian food recipes, step-by-step cooking guides, and delicious ideas for appetizers, noodles, soups, desserts & more",
  url: "https://www.asianfoodsdaily.com",
  twitterHandle: "@asianfoodsdaily",
  brand: {
    name: "Asian Foods Daily",
    logo: "https://cdn.pagesmith.app/97394d4a-9281-4e16-8125-5ce5d075881b/Thai-Cucumber-Shrimp-Salad-2-1536x857-1536.webp",
    colors: {
      primary: "#dc2626", // Red for Asian theme
      secondary: "#f97316",
      accent: "#fbbf24",
    }
  }
};

// Re-export as SITE for compatibility
export const SITE = {
  ...siteConfig,
  name: siteConfig.title || siteConfig.name || 'My Site',
};
