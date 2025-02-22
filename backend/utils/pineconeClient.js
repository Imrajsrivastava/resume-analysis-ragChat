const { Pinecone } = require("@pinecone-database/pinecone");
require("dotenv").config();

let pineconeIndex = null;

async function initializePinecone() {
  if (pineconeIndex) return pineconeIndex;
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    return pineconeIndex;
  } catch (error) {
    console.error("Error initializing Pinecone:", error);
    throw error;
  }
}

async function getIndex() {
  if (!pineconeIndex) {
    await initializePinecone();
  }
  return pineconeIndex;
}

module.exports = { getIndex };
