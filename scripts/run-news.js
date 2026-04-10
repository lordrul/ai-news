const fetchNews = require("./fetch-news");

async function run() {
  try {
    console.log("Fetching news...");
    await fetchNews();
    console.log("Done!");
  } catch (error) {
    console.error("Error fetching news:", error);
    process.exitCode = 1;
  }
}

run();
