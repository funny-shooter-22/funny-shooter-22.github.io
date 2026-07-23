const { generateGameCard } = require('./cardGenerator');
const { generateIndexMetaTags, generateIndexStructuredData } = require('../utils/seoBuilder');
const { escapeHtml, escapeHtmlAttr } = require('../utils/htmlEscape');
const { getThumbPath } = require('../utils/assetManager');
const { INITIAL_ROWS, ROWS_PER_LOAD, SCROLL_THRESHOLD, EAGER_LOAD_CARDS } = require('../utils/constants');

// Category to icon mapping (kept for sidebar)
const categoryIcons = {
  'Home': '🏠',
  'All Games': '🎮',
  'Trending Games': '🔥',
  'Newly Added': '✨',
  'Action': '⚔️',
  'Puzzle': '🧩',
  'Shooter': '🔫',
  'Clickers': '👆',
  'Horror': '👻',
  'Racing': '🏎️',
  'Adventure': '🗺️',
  'Sports': '⚽',
  'Strategy': '♟️',
  'Platformer': '🏃',
  'RPG': '🎭',
  'Simulation': '🎯',
  'Multiplayer': '👥',
  'Arcade': '🕹️',
  'Fighting': '🥊',
  'Rhythm': '🎵',
  'Music': '🎶',
  'Building': '🏗️',
  'Survival': '🏕️',
  'Roguelike': '💀',
  'Retro': '👾',
  '2 Player': '👫',
  'Football': '🏈',
  'Basketball': '🏀',
  'Card': '🃏',
  'IO': '🌐',
  'Uncategorized': '📁'
};

// Get icon for a category, with fallback
function getCategoryIcon(category) {
  return categoryIcons[category] || '🎯';
}

/**
 * Seeded random number generator for consistent shuffling
 * Uses a simple LCG (Linear Congruential Generator)
 */
function seededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Shuffle array using Fisher-Yates with seeded random
 * @param {Array} array - Array to shuffle
 * @param {number} seed - Random seed
 * @returns {Array} Shuffled array (new array, doesn't mutate original)
 */
function shuffleArray(array, seed) {
  const shuffled = [...array];
  const random = seededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Generate the full HTML for the index page
 * @param {Array} games - Array of game objects
 * @param {Object} categories - Object with category keys and game arrays
 * @param {string} mainStyles - CSS content string to embed in <style> tag
 * @param {string} clientJS - JavaScript content string to embed in <script> tag
 * @param {string} gamesDir - Optional path to games directory (for asset resolution)
 * @returns {string} Complete HTML document
 */
function generateIndexHTML(games, categories, mainStyles, clientJS, gamesDir = '.') {
  // Generate sidebar categories - sorted by game count (largest first)
  // Filter out categories with less than 2 games, and exclude special categories
  const sidebarCategories = Object.keys(categories)
    .filter(cat => cat !== "Recently Played" && cat !== "Trending Games" && cat !== "Newly Added")
    .filter(cat => categories[cat].length >= 2)
    .sort((a, b) => categories[b].length - categories[a].length)
    .map(cat => {
      const escapedCat = escapeHtmlAttr(cat);
      const escapedCatText = escapeHtml(cat);
      return `<li role="menuitem" tabindex="0" onclick="filterCategory('${escapedCat}')" onkeypress="if(event.key==='Enter')filterCategory('${escapedCat}')"><span class="icon">${getCategoryIcon(cat)}</span><span class="text">${escapedCatText}</span></li>`;
    })
    .join("");

  // Fixed sidebar items for Recently Played and Newly Added
  const recentlyPlayedItem = `<li role="menuitem" tabindex="0" id="recentlyPlayedNav" onclick="filterCategory('Recently Played')" onkeypress="if(event.key==='Enter')filterCategory('Recently Played')" style="display:none"><span class="icon">🕐</span><span class="text">Recently Played</span></li>`;
  const newlyAddedItem = `<li role="menuitem" tabindex="0" onclick="filterCategory('Newly Added')" onkeypress="if(event.key==='Enter')filterCategory('Newly Added')"><span class="icon">✨</span><span class="text">Newly Added</span></li>`;

  // Use current date as seed for daily randomization
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  // Separate priority games from non-priority games
  const priorityGames = games.filter(game => game.priority > 0);
  const nonPriorityGames = games.filter(game => !game.priority || game.priority === 0);

  // Sort priority games by priority value (highest first)
  const sortedPriorityGames = priorityGames.sort((a, b) => b.priority - a.priority);

  // Shuffle non-priority games with seeded random for consistent daily order
  const shuffledNonPriorityGames = shuffleArray(nonPriorityGames, seed);

  // Combine: priority games first, then shuffled non-priority games
  const shuffledGames = [...sortedPriorityGames, ...shuffledNonPriorityGames];

  // Calculate how many games to render initially (INITIAL_ROWS * 6 columns)
  const columnsPerRow = 6;
  const initialGameCount = INITIAL_ROWS * columnsPerRow;
  const initialGames = shuffledGames.slice(0, initialGameCount);

  // Prepare game data for client-side lazy loading
  // Only include necessary fields to minimize payload
  const gameDataForClient = shuffledGames.map(game => {
    const thumbInfo = getThumbPath(game, gamesDir);
    return {
      n: game.name,                    // name
      f: game.folder,                  // folder
      t: thumbInfo.path,               // thumbnail path
      a: game.otherNames || [],        // aliases for search
      c: game.categories || [],        // categories for filtering
      d: game.createdAt || null        // createdAt date for Newly Added
    };
  });

  // Calculate Newly Added games (top 30 by createdAt date, most recent first)
  const newlyAddedFolders = [...games]
    .filter(g => g.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 30)
    .map(g => g.folder);

  // Generate initial game cards HTML
  let initialCardsHTML = '';
  initialGames.forEach((game, idx) => {
    initialCardsHTML += generateGameCard(game, idx, gamesDir, true);
  });

  // Get SEO meta tags and structured data
  const metaTags = generateIndexMetaTags();
  const structuredData = generateIndexStructuredData(games);

  // Full HTML template
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${metaTags}

  <!-- Resource Hints for Performance -->
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>

  <!-- Optimize Google Fonts loading -->
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"></noscript>

  <!-- Preload critical assets -->
  <link rel="preload" as="image" href="assets/logo.webp" fetchpriority="high">

  <!-- Redirect /index.html to / -->
  <script>
    if (window.location.pathname === '/index.html') {
      window.location.replace('/' + window.location.hash);
    }
  </script>

  <!-- Structured Data for Search Engines -->
  ${structuredData}

  <style>
    ${mainStyles}

  </style>
</head>
<body>

  <!-- Sidebar -->
  <nav id="sidebar" role="navigation" aria-label="Game categories">
    <ul id="categoryList" role="menu">
      <li role="menuitem" tabindex="0" onclick="window.location.href='/'" onkeypress="if(event.key==='Enter')window.location.href='/'"><span class="icon">🏠</span><span class="text">Home</span></li>
      ${recentlyPlayedItem}
      ${newlyAddedItem}
      ${sidebarCategories}
    </ul>
  </nav>
  <div id="sidebarIndicator" aria-hidden="true"></div>

  <!-- Content -->
  <div id="content" role="main">
    <!-- Top Header with Search -->
    <header id="topHeader">
      <div class="header-left">
        <img src="assets/logo.webp" alt="Funny Shooter 22 Logo" class="header-logo" onclick="window.location.href='/'" width="48" height="48" fetchpriority="high">
        <h1 onclick="window.location.href='/'">Funny Shooter 22</h1>
      </div>
      <div id="searchContainer" role="search">
        <span id="searchIcon" aria-hidden="true">🔍</span>
        <input type="text" id="searchBar" placeholder="Search games..." oninput="searchGames(this.value)" aria-label="Search for games" autocomplete="off">
        <div id="searchDropdown" role="listbox" aria-label="Search results"></div>
      </div>
    </header>

    <div class="content-wrapper" id="main-content">
      <div id="controls">
        <button id="backBtn" onclick="closeGame()" aria-label="Go back to game list">← Back</button>
        <span id="gameTitle" role="heading" aria-level="2"></span>
        <button id="fullscreenBtn" onclick="toggleFullscreen()" aria-label="Toggle fullscreen mode">⛶ Fullscreen</button>
      </div>

      <div class="viewer-wrapper">
        <!-- Game Viewer -->
        <div class="viewer" id="viewer">
          <div id="startOverlay">
            <img id="startThumb" src="" alt="Game Thumbnail" width="300" height="300" loading="eager">
            <h1 id="startName"></h1>
            <button id="startButton" onclick="startGame()">▶ Play</button>
          </div>
          <iframe id="gameFrame" src="" scrolling="no"></iframe>
        </div>
      </div>

      <!-- All Games Grid -->
      <div class="category" data-category="All Games" id="allGamesSection">
        <h2>All Games</h2>
        <div class="grid" id="gamesGrid">
          ${initialCardsHTML}
        </div>
        <div id="loadingIndicator" style="display:none;text-align:center;padding:2rem;">
          <div class="loading-spinner"></div>
        </div>
        <div id="scrollSentinel" style="height:1px;"></div>
      </div>

      <footer id="siteFooter">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>Funny Shooter 22</h3>
            <span class="footer-url">funny-shooter-22.github.io</span>
          </div>
          <div class="footer-links">
            <a href="/important-pages/privacy-policy.html">Privacy Policy</a>
            <a href="/important-pages/terms-of-service.html">Terms of Service</a>
            <a href="/important-pages/contact.html">Contact</a>
            <a href="/important-pages/dmca.html">DMCA</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} Funny Shooter 22. All rights reserved.</p>
        </div>
      </footer>
    </div>
  </div>

  <!-- Game Data for Lazy Loading -->
  <script>
    window.__gameData = ${JSON.stringify(gameDataForClient)};
    window.__renderedCount = ${initialGameCount};
    window.__rowsPerLoad = ${ROWS_PER_LOAD};
    window.__scrollThreshold = ${SCROLL_THRESHOLD};
    // Newly Added games (folders list)
    window.__newlyAddedFolders = ${JSON.stringify(newlyAddedFolders)};
  </script>

  <script>
    ${clientJS}
  </script>
</body>
</html>`;

  return html;
}

module.exports = {
  generateIndexHTML
};