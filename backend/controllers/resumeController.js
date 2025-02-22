const pdfParser = require("../utils/pdfParser");
const docxParser = require("../utils/docxParser");
const geminiEmbeddings = require("../utils/geminiEmbeddings");
const pineconeClient = require("../utils/pineconeClient");
const ragChatbot = require("../utils/ragChatbot");
const crypto = require("crypto");
const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    let resumeText = "";
    if (req.file.mimetype === "application/pdf") {
      resumeText = await pdfParser.parsePdf(req.file.buffer);
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      resumeText = await docxParser.parseDocx(req.file.buffer);
    } else {
      return res.status(400).send("Unsupported file type.");
    }
    // const summaryPrompt = `Summarize the following resume text:\n${resumeText}\n\nSummary:`;
    // const summary = await geminiEmbeddings.generateText(summaryPrompt);
    const autofillPrompt = `Extract key information from the following resume text to fill these fields: Name, Email, Skills, Experience. \nResume Text:\n${resumeText}\n\nExtracted Information:`;
    const autofillData = await geminiEmbeddings.generateText(autofillPrompt);

    const embedding = await geminiEmbeddings.embedText(resumeText);
    const pineconeIndex = await pineconeClient.getIndex();
    const resumeHash = crypto
      .createHash("sha256")
      .update(resumeText)
      .digest("hex");

    await pineconeIndex.upsert([
      {
        id: resumeHash,
        values: embedding,
        metadata: { text: resumeText },
      },
    ]);

    res.json({
      // summary: summary,
      autofill: autofillData,
      message: "Resume processed and indexed.",
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).send("Error processing resume.");
  }
};

const chatWithResume = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).send("Question is required.");
  }

  try {
    const answer = await ragChatbot.askQuestion(question);
    res.json({ answer: answer });
  } catch (error) {
    console.error("Error in chatbot:", error);
    res.status(500).send("Error in chatbot.");
  }
};

module.exports = {
  uploadResume,
  chatWithResume,
};

//TODO:
//will add lainchan and chunk things to optimize the code
