const geminiEmbeddings = require("./geminiEmbeddings");
const pineconeClient = require("./pineconeClient");

async function askQuestion(question) {
  console.log("askQuestion------ragChatbot", question);
  try {
    const questionEmbedding = await geminiEmbeddings.embedText(question);
    const pineconeIndex = await pineconeClient.getIndex();

    const queryResponse = await pineconeIndex.query({
      vector: questionEmbedding,
      topK: 3,
      includeMetadata: true,
    });
    console.log("queryResponse------ragChatbot", queryResponse);

    if (!queryResponse.matches.length) {
      return "No relevant information found in the resume for this question.";
    }

    const context = queryResponse.matches
      .map((match) => match.metadata.text)
      .join("\n");
    console.log("context------ragChatbot", context);
    const prompt = `Answer the following question based on the context provided from the resume.\nQuestion: ${question}\n\nContext:\n${context}\n\nAnswer:`;
    console.log("prompt------ragChatbot", prompt);
    const answer = await geminiEmbeddings.generateText(prompt);
    console.log("answer------ragChatbot", answer);
    return answer;
  } catch (error) {
    console.error("Error in RAG chatbot:", error);
    throw error;
  }
}

module.exports = { askQuestion };
