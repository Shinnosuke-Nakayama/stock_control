const { ApifyClient } = require("apify-client");
require("dotenv").config();

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

const getTrump = async () => {
  const input = {
    truthSocialUsername: ["realDonaldTrump"],
    maxPosts: 5,
    excludeReplies: true,
    includeReblogs: false,
    cleanContent: true,
  };

  const donald = await client
    .actor("scrapier/truth-social-scraper")
    .call(input);

  const { items } = await client.dataset(donald.defaultDatasetId).listItems();

  return items;
};

module.exports = { getTrump };
