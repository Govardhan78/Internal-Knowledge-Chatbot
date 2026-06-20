// import { OpenAIEmbeddings } from "@langchain/openai";

// export const embeddings = new OpenAIEmbeddings({
//   model: "text-embedding-3-small",
// });

import { pipeline } from "@xenova/transformers";

let extractor;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  return extractor;
}

export const embeddings = {
  async embedDocuments(texts) {
    const model = await getExtractor();

    return Promise.all(
      texts.map(async (text) => {
        const output = await model(text, {
          pooling: "mean",
          normalize: true,
        });

        return Array.from(output.data);
      }),
    );
  },

  async embedQuery(text) {
    const model = await getExtractor();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  },
};
