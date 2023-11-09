const puppeteer = require("puppeteer");

const LAST_HREF = "/fonts/manrope";
const DELAY_BETWEEN_SCROLLS = 3 * 1000;

async function getAllFontShareFontSlugs() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://fontshare.com", { waitUntil: "domcontentloaded" });

    // Use a Set to avoid duplicates
    const slugs = new Set();

    while (true) {
      await page.waitForSelector(".SpHjZE6q");
      console.log("Found at least one .SpHjZE6q element");

      const data = await page.evaluate(() => {
        const linkAnchors = Array.from(document.querySelectorAll(".SpHjZE6q"));
        const slugs = [];

        linkAnchors.forEach((anchor) => {
          const href = anchor.getAttribute("href");
          const slugMatch = href.match(/\/fonts\/(.*)/);
          if (slugMatch) {
            slugs.push(slugMatch[1]);
          }
        });

        return slugs;
      });
      console.log("Captured data of length", data.length);

      data.forEach((slug) => slugs.add(slug)); // Add new slugs to the Set

      // Scroll to the end of the content container
      await page.evaluate(() => {
        const scrollContainer = document.getElementById("scrollContainer");
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      });

      // Check for the appearance of an anchor with the specified href
      const endOfContent = await page.evaluate((LAST_HREF) => {
        const endAnchor = document.querySelector(`a[href="${LAST_HREF}"]`);
        return !!endAnchor;
      }, LAST_HREF);

      if (endOfContent) {
        break;
      }

      await page.waitForTimeout(DELAY_BETWEEN_SCROLLS);
      console.log("Waiting for new items to load...");
    }

    console.log("Done! Here's what we got:", Array.from(slugs));

    await browser.close();
  } catch (error) {
    console.error("Error scraping data:", error);
  }
}

getAllFontShareFontSlugs();

// [
//   'satoshi',           'clash-display',    'general-sans',
//   'cabinet-grotesk',   'ranade',           'chillax',
//   'clash-grotesk',     'switzer',          'panchang',
//   'stardom',           'zodiak',           'sentient',
//   'supreme',           'boska',            'author',
//   'telma',             'bespoke-serif',    'gambetta',
//   'tanker',            'excon',            'gambarino',
//   'neco',              'alpino',           'quilon',
//   'pally',             'bespoke-sans',     'erode',
//   'pencerio',          'nippo',            'sharpie',
//   'pramukh-rounded',   'plein',            'bespoke-stencil',
//   'amulya',            'bevellier',        'synonym',
//   'bonny',             'comico',           'rowan',
//   'aktura',            'technor',          'bespoke-slab',
//   'britney',           'array',            'styro',
//   'recia',             'melodrama',        'rosaline',
//   'hoover',            'trench-slab',      'chubbo',
//   'boxing',            'rx-100',           'kola',
//   'paquito',           'zina',             'tabular',
//   'expose',            'segment',          'kihim',
//   'pilcrow-rounded',   'striper',          'new-title',
//   'kohinoor-zerone',   'quicksand',        'kalam',
//   'merriweather-sans', 'asap',             'nunito',
//   'crimson-pro',       'karma',            'red-hat-display',
//   'plus-jakarta-sans', 'familjen-grotesk', 'beVietnam-pro',
//   'literata',          'hind',             'bebas-neue',
//   'public-sans',       'lora',             'work-sans',
//   'epilogue',          'anton',            'khand',
//   'azeret-mono',       'dancing-script',   'fira-sans',
//   'rajdhani',          'outfit',           'sora',
//   'poppins',           'oswald',           'space-grotesk',
//   'archivo',           'jet-brains-mono',  'montserrat',
//   'teko',              'roundo',           'spline-sans',
//   'manrope'
// ]
