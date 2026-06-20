import { groq } from "../config/groq.js";
import { getRelevantContext } from "./retrieval.service.js";
import Chat from "../models/Chat.js";

export const askQuestion = async (question, userId) => {
  const chunks = await getRelevantContext(question);

  const context = chunks.map((chunk) => chunk.pageContent).join("\n\n");

  const SYSTEM_PROMPT = `You are an internal knowledge assistant.
Answer only from the provided context.
If the answer is not present in the context, say "I don't know based on the available documents."`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Question: ${question}\n\nContext:\n${context}\n\nAnswer:`,
      },
    ],
  });

  const answer = completion.choices[0].message.content;

  await Chat.create({ userId, question, answer });

  return answer;
};
