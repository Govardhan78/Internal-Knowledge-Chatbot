import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./embeddings.js";
import { pineconeIndex } from "./pinecone.js";

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
//   maxConcurrency: 5,
});
