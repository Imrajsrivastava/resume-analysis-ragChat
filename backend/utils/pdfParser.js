const pdfParse = require('pdf-parse');
async function parsePdf(pdfBuffer) {

    try {
        const data = await pdfParse(pdfBuffer);
        return data.text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw error;
    }
}

module.exports = { parsePdf };