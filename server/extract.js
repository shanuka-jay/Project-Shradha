const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extract() {
    try {
        const docxPath = '/Users/pramodwijenayake/Desktop/Project-Shradha/SRI LANKAN BUDDHIST TEMPLES IN USA (1).docx';
        const docxResult = await mammoth.extractRawText({path: docxPath});
        console.log("=== DOCX CONTENT ===");
        console.log(docxResult.value.substring(0, 1000) + '... (truncated)');
        
        fs.writeFileSync('/Users/pramodwijenayake/Desktop/Project-Shradha/temples_extracted.txt', docxResult.value);
        console.log("Wrote full DOCX text to temples_extracted.txt");

        const pdfPath = '/Users/pramodwijenayake/Desktop/Project-Shradha/Saddha org project srs.pdf';
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfResult = await pdfParse(pdfBuffer);
        console.log("\n=== PDF CONTENT ===");
        console.log(pdfResult.text.substring(0, 1000) + '... (truncated)');
        
        fs.writeFileSync('/Users/pramodwijenayake/Desktop/Project-Shradha/srs_extracted.txt', pdfResult.text);
        console.log("Wrote full PDF text to srs_extracted.txt");
    } catch(err) {
        console.error(err);
    }
}
extract();
