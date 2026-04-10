const fs = require("fs/promises");
const path = require("path");
const Parser = require("rss-parser");

const parser = new Parser();

const FEEDS = [
  "https://techcrunch.com/tag/artificial-intelligence/feed/",
  "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
  "https://feeds.feedburner.com/venturebeat/SZYF",
];

const OUTPUT_PATH = path.join(__dirname, "..", "data", "ai-news.json");
const ARTICLE_LIMIT = 15;

function normalizeArticle(item) {
  return {
    title: item.title || "",
    summary: item.contentSnippet || "",
    url: item.link || "",
    date: item.pubDate || "",
  };
}

function sortByNewestFirst(a, b) {
  const aTime = new Date(a.date).getTime() || 0;
  const bTime = new Date(b.date).getTime() || 0;
  return bTime - aTime;
}

async function fetchFeed(url) {
  console.log(`Fetching feed: ${url}`);
  const feed = await parser.parseURL(url);
  const items = Array.isArray(feed.items) ? feed.items : [];
  console.log(`Fetched ${items.length} items from ${feed.title || url}`);
  return items.map(normalizeArticle);
}

async function main() {
  try {
    console.log("Starting AI news fetch...");

    const feedResults = await Promise.all(
      FEEDS.map(async (url) => {
        try {
          return await fetchFeed(url);
        } catch (error) {
          console.error(`Failed to fetch ${url}:`, error.message);
          return [];
        }
      })
    );

    console.log("Combining feed items...");
    const combinedArticles = feedResults.flat();

    console.log("Removing duplicate titles...");
    const uniqueArticles = Array.from(
      new Map(
        combinedArticles
          .filter((article) => article.title)
          .map((article) => [article.title.trim().toLowerCase(), article])
      ).values()
    );

    console.log("Sorting articles by newest first...");
    const latestArticles = uniqueArticles
      .sort(sortByNewestFirst)
      .slice(0, ARTICLE_LIMIT);

    console.log(`Writing ${latestArticles.length} articles to ${OUTPUT_PATH}...`);
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(latestArticles, null, 2), "utf8");

    console.log("AI news saved successfully.");
  } catch (error) {
    console.error("Unexpected error while fetching AI news:", error);
    throw error;
  }
}

module.exports = main;

if (require.main === module) {
  main();
}
