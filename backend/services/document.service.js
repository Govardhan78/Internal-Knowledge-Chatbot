// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { splitText } from "../utils/textSplitter.js";
// import { vectorStore } from "../config/vectorStore.js";

// export const indexDocument = async (filePath) => {
//   const loader = new PDFLoader(filePath, {
//     splitPages: false,
//   });

//   const docs = await loader.load();

//   const chunks = await splitText(docs[0].pageContent);

//   const documents = chunks.map((chunk) => ({
//     pageContent: chunk,
//     metadata: docs[0].metadata,
//   }));
//   console.log("Chunks:", chunks.length);
//   console.log("Documents:", documents.length);
//   console.log(documents[0]);

//   await vectorStore.addDocuments(documents);

//   const vectors = await embeddings.embedDocuments(
//     documents.map((doc) => doc.pageContent),
//   );

//   console.log("Vectors generated:", vectors.length);
//   console.log("Vector dimension:", vectors[0]?.length);
//   return {
//     totalChunks: documents.length,
//   };
// };

import crypto from "crypto";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { splitText } from "../utils/textSplitter.js";
import { embeddings } from "../config/embeddings.js";
import { pineconeIndex } from "../config/pinecone.js";
import Document from "../models/Document.js";


export const indexDocument = async (filePath) => {
  const loader = new PDFLoader(filePath, {
    splitPages: false,
  });

  const docs = await loader.load();

  const chunks = await splitText(docs[0].pageContent);

  const vectors = await embeddings.embedDocuments(chunks);

  const records = chunks.map((chunk, index) => ({
    id: crypto.randomUUID(),
    values: vectors[index],
    metadata: {
      text: chunk,
      source: docs[0].metadata.source,
    },
  }));

  await pineconeIndex.upsert({
    records,
  });
  await Document.create({
    fileName: filePath.split("\\").pop(),
    source: docs[0].metadata.source,
    totalChunks: chunks.length,
  });
  return {
    totalChunks: chunks.length,
  };
};
