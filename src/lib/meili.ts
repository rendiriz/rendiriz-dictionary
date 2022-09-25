const { MeiliSearch } = require('meilisearch');

export const meili = new MeiliSearch({
  host: process.env.MEILI_API_URL,
  apiKey: process.env.MEILI_MASTER_KEY,
});
