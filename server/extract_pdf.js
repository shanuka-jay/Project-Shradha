const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    try {
        const pdfPath = '/Users/pramodwijenayake/Desktop/Project-Shradha/Saddha org project srs.pdf';
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfResult = await pdf(pdfBuffer);
        
        fs.writeFileSync('/Users/pramodwijenayake/Desktop/Project-Shradha/srs_extracted.txt', pdfResult.text);
        console.log("Wrote full PDF text to srs_extracted.txt");
    } catch(err) {
        console.error(err);
    }
}
extract();
