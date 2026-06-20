import { embeddings } from "../config/embeddings.js";
import { pineconeIndex } from "../config/pinecone.js";

export const getRelevantContext = async (question, topK = 3) => {
  const queryVector = await embeddings.embedQuery(question);

  const result = await pineconeIndex.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return result.matches.map((match) => ({
    pageContent: match.metadata?.text ?? "",
    metadata: match.metadata,
    score: match.score,
  }));
};
