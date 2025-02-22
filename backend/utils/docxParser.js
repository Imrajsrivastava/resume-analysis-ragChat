const docxParser = require("docx-parser");
async function parseDocx(docxBuffer) {
  try {
    const text = await docxParser.parseDocx(docxBuffer);
    return text;
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw error;
  }
}

module.exports = { parseDocx };
