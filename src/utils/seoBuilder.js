/**
 * SEO Builder Module
 * Generates comprehensive SEO meta tags, structured data, and optimization for all pages
 * Keywords focus: free, online, games, browser, no download
 */

const BASE_URL = 'https://funny-shooter-22.github.io';
const SITE_NAME = 'Funny Shooter 22';
const LOGO_URL = `${BASE_URL}/assets/logo.webp`;
const OG_IMAGE_URL = `${BASE_URL}/assets/og-image.png`;

// Favicon links shared by all pages (absolute paths so they work at any depth)
const FAVICON_LINKS = `<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">`;

// Primary SEO keywords (kept short — search engines ignore long keyword
// lists and excessive repetition reads as stuffing)
const PRIMARY_KEYWORDS = [
  'free online games',
  'browser games',
  'no download games',
  'funny shooter 22',
  'play games online free'
];

/**
 * Generate SEO meta tags for main index page
 * @returns {string} HTML string with meta tags
 */
function generateIndexMetaTags() {
  const title = 'Funny Shooter 22 - Play Free Online Games | No Download Required';
  const description = 'Play 100+ free online games at Funny Shooter 22! No downloads, no installation - play instantly in your browser. Enjoy action, shooter, puzzle, and arcade games for free.';
  const keywords = PRIMARY_KEYWORDS.join(', ');

  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Primary Meta Tags -->
  <title>${title}</title>
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="language" content="English">
  <meta name="author" content="${SITE_NAME}">
  <meta name="revisit-after" content="1 days">
  <meta name="rating" content="general">
  <meta name="distribution" content="global">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${OG_IMAGE_URL}">
  <meta property="og:image:alt" content="Funny Shooter 22 - Play Free Online Games">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="en_US">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${BASE_URL}/">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${OG_IMAGE_URL}">
  <meta name="twitter:image:alt" content="Funny Shooter 22 - Play Free Online Games">

  <!-- Favicon -->
  ${FAVICON_LINKS}

  <!-- Additional SEO -->
  <meta name="theme-color" content="#ff66ff">
  <link rel="canonical" href="${BASE_URL}/">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="format-detection" content="telephone=no">

  <!-- Preconnect for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;
}

/**
 * Generate structured data (JSON-LD) for main index page
 * @param {Array} games - Array of all games for ItemList
 * @returns {string} Script tag with JSON-LD structured data
 */
function generateIndexStructuredData(games = []) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "alternateName": ["Free Online Games", "Browser Games", "No Download Games", "Games Online Free"],
    "url": `${BASE_URL}/`,
    "description": "Funny Shooter 22 - Play 100+ free online games in your browser! No downloads required. Instant play free games.",
    "image": LOGO_URL,
    "inLanguage": "en-US",
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL,
        "width": 512,
        "height": 512
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": `${BASE_URL}/`,
    "logo": LOGO_URL,
    "description": "Funny Shooter 22 - Free online games website. Play free browser games instantly - no downloads!",
    "sameAs": []
  };

  // Create ItemList for game collection (helps with rich snippets)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Funny Shooter 22 - Free Online Games",
    "description": "Collection of free online browser games - play instantly, no downloads required",
    "numberOfItems": games.length || 100,
    "itemListElement": games.slice(0, 20).map((game, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoGame",
        "name": game.name,
        "url": `${BASE_URL}/${game.folder}.html`,
        "playMode": "SinglePlayer",
        "gamePlatform": "Web Browser",
        "applicationCategory": "Game",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    }))
  };

  return `<script type="application/ld+json">
${JSON.stringify(websiteSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(organizationSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(itemListSchema, null, 2)}
  </script>`;
}

/**
 * Generate game-specific keywords based on game name and categories
 * @param {Object} game - Game object
 * @returns {string} Comma-separated keywords
 */
function generateGameKeywords(game) {
  const gameName = game.name;
  const gameNameLower = gameName.toLowerCase();
  const categories = game.categories || [];

  const gameSpecificKeywords = [
    `${gameName}`,
    `${gameName} online`,
    `play ${gameName} free`,
    `${gameName} no download`,
    ...categories.slice(0, 3).map(cat => `${cat.toLowerCase()} games online`),
    'free online games',
    'browser games',
    'no download games'
  ];

  return gameSpecificKeywords.join(', ');
}

/**
 * Generate SEO meta tags for game page
 * @param {Object} game - Game object
 * @param {string} thumbPath - Path to game thumbnail
 * @returns {string} HTML string with meta tags
 */
function generateGameMetaTags(game, thumbPath) {
  const gameName = game.name;
  const categories = game.categories || [];
  const categoryText = categories.length > 0 ? categories.join(', ') : 'Action';

  // SEO-optimized title variations - (game name) Online Free - Play Now
  const gameTitle = `${gameName} Online Free - Play Now | Funny Shooter 22`;

  // Rich, keyword-dense description with free, online, browser, no download keywords
  const gameDescription = `Play ${gameName} online free! Enjoy ${gameName} in your browser with no downloads required. ${gameName} is a popular ${categoryText.toLowerCase()} game that works instantly. Play ${gameName} free now - no installation needed!`;

  const gameUrl = `${BASE_URL}/${game.folder}.html`;
  const imageUrl = `${BASE_URL}/${thumbPath}`;
  const keywords = generateGameKeywords(game);

  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Primary Meta Tags -->
  <title>${gameTitle}</title>
  <meta name="title" content="${gameTitle}">
  <meta name="description" content="${gameDescription}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="language" content="English">
  <meta name="author" content="${SITE_NAME}">
  <meta name="revisit-after" content="7 days">
  <meta name="rating" content="general">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="game">
  <meta property="og:url" content="${gameUrl}">
  <meta property="og:title" content="${gameTitle}">
  <meta property="og:description" content="${gameDescription}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:alt" content="${gameName} Online Free - Play Now">
  <meta property="og:image:width" content="300">
  <meta property="og:image:height" content="300">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="en_US">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:url" content="${gameUrl}">
  <meta name="twitter:title" content="${gameTitle}">
  <meta name="twitter:description" content="${gameDescription}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${gameName} Online Free - Play Now">

  <!-- Game-specific meta -->
  <meta property="game:name" content="${gameName}">
  <meta property="game:category" content="${categoryText}">
  <meta property="game:platform" content="Web Browser">

  <!-- Favicon -->
  ${FAVICON_LINKS}

  <!-- Additional SEO -->
  <meta name="theme-color" content="#ff66ff">
  <link rel="canonical" href="${gameUrl}">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">`;
}

/**
 * Generate structured data (JSON-LD) for game page
 * @param {Object} game - Game object
 * @param {string} thumbPath - Path to game thumbnail
 * @returns {string} Script tag with JSON-LD structured data
 */
function generateGameStructuredData(game, thumbPath) {
  const gameName = game.name;
  const categories = game.categories || [];
  const gameUrl = `${BASE_URL}/${game.folder}.html`;
  const imageUrl = `${BASE_URL}/${thumbPath}`;

  // VideoGame Schema - primary game data
  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": gameName,
    "alternateName": [`${gameName} Online`, `${gameName} Free`, `Play ${gameName} Free`, `${gameName} Browser`],
    "url": gameUrl,
    "description": `Play ${gameName} online free! Enjoy this popular ${categories.join(', ').toLowerCase() || 'action'} game in your browser. No downloads required - play free instantly!`,
    "image": imageUrl,
    "thumbnailUrl": imageUrl,
    "genre": categories,
    "gamePlatform": ["Web Browser", "PC", "Mac", "Mobile"],
    "operatingSystem": "Any",
    "applicationCategory": "Game",
    "playMode": "SinglePlayer",
    "numberOfPlayers": {
      "@type": "QuantitativeValue",
      "minValue": 1,
      "maxValue": 1
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "category": "Free"
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": `${BASE_URL}/`,
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
      }
    }
  };

  // BreadcrumbList Schema - for navigation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${BASE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categories[0] || "Games",
        "item": `${BASE_URL}/#/category/${encodeURIComponent(categories[0] || 'Games')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": gameName,
        "item": gameUrl
      }
    ]
  };

  // WebPage Schema - for the page itself
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${gameName} Online Free - Play Now`,
    "description": `Play ${gameName} online free in your browser - free browser games, no downloads`,
    "url": gameUrl,
    "image": imageUrl,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": `${BASE_URL}/`
    },
    "about": {
      "@type": "VideoGame",
      "name": gameName
    },
    "mainEntity": {
      "@type": "VideoGame",
      "name": gameName,
      "url": gameUrl
    }
  };

  return `<script type="application/ld+json">
${JSON.stringify(gameSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(webPageSchema, null, 2)}
  </script>`;
}

/**
 * Generate SEO-friendly page title for game
 * @param {Object} game - Game object
 * @returns {string} SEO title
 */
function generateGameSEOTitle(game) {
  return `${game.name} Online Free - Play Now | Funny Shooter 22`;
}

/**
 * Generate SEO-friendly description for game
 * Uses custom description if provided, otherwise generates a default one
 * @param {Object} game - Game object
 * @returns {string} SEO description
 */
function generateGameSEODescription(game) {
  // If game has a custom description, use it
  if (game.description && game.description.trim()) {
    return game.description.trim();
  }

  // Otherwise, generate default description
  const categories = game.categories || [];
  const categoryText = categories.length > 0 ? categories[0].toLowerCase() : 'action';
  return `Play ${game.name} online free! This ${categoryText} game works in your browser with no downloads. Play ${game.name} free instantly!`;
}

module.exports = {
  generateIndexMetaTags,
  generateIndexStructuredData,
  generateGameMetaTags,
  generateGameStructuredData,
  generateGameKeywords,
  generateGameSEOTitle,
  generateGameSEODescription,
  BASE_URL,
  SITE_NAME,
  LOGO_URL,
  PRIMARY_KEYWORDS
};
