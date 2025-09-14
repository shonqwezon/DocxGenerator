const { contextBridge } = require('electron')
const path = require("node:path");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const fs = require("fs");
const os = require('os');
// expose simple storage API to renderer
contextBridge.exposeInMainWorld('storage', {
  save: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  load: (key) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
});

contextBridge.exposeInMainWorld('docxProcessor', {
  patchFiles: async (files, fields) => {
    try {
      for (const fileName of files) {
        outputDir = path.join(os.homedir(), 'output')
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
        const content = fs.readFileSync(
          path.resolve(path.join(os.homedir(), 'input'), fileName),
          "binary"
        );
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        doc.render(fields);
        const buf = doc.toBuffer();
        fs.writeFileSync(path.resolve(outputDir, fileName), buf);
      }

      return true
    } catch (err) {
      console.error('Error patching DOCX files:', err)
      return false
    }
  }
});
