const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const baseDirectory = path.join(__dirname, "../uploads");

const fileCreation = (htmlContent, cssContent, fileName) => {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load(htmlContent);
        const styleElement = $(`<style></style>`).text(cssContent);
        $(`head`).append(styleElement);
        const updatedHtmlContent = $.html();
        const outputPath = path.join(baseDirectory, fileName);
        fs.writeFile(outputPath, updatedHtmlContent, (error) => {
            if (error) {
                reject(error);
            } else {
                console.log(`File ${fileName} has been created successfully.`);
                resolve(outputPath);
            }
        });
    });
};

module.exports = fileCreation;
