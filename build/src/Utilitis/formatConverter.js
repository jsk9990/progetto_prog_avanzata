"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToXML = exports.generatePDF = exports.writeCSV = void 0;
// utils/writeCSV.ts
const json2csv_1 = require("json2csv");
const writeCSV = (data) => {
    const parser = new json2csv_1.Parser();
    const csv = parser.parse(data);
    return csv;
};
exports.writeCSV = writeCSV;
// utils/generatePDF.ts
const pdfkit_1 = __importDefault(require("pdfkit"));
const generatePDF = (data) => {
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default();
        let buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        doc.on('error', reject);
        // Aggiungi qui il contenuto del PDF, ad esempio:
        doc.text(JSON.stringify(data, null, 2));
        doc.end();
        // Poiché PDFKit è asincrono, dobbiamo restituire una Promise
    });
};
exports.generatePDF = generatePDF;
// utils/convertToXML.ts
const json2xml_1 = __importDefault(require("json2xml"));
const convertToXML = (data) => {
    // Assicurati che i dati siano strutturati correttamente per la conversione in XML
    const obj = {
        aggiornamento: data // 'aggiornamento' è l'elemento che racchiude ogni oggetto nell'array
    };
    // Converti l'oggetto JSON in una stringa XML
    const xml = (0, json2xml_1.default)(obj);
    return xml;
};
exports.convertToXML = convertToXML;
/*
export const convertToXML = (data: any[]): string => {
    
    const obj = { aggiornamenti: { aggiornamento: data } };
    
    const builder = new Builder({
        rootName: 'aggiornamenti',
        xmldec: { version: '1.0', encoding: 'UTF-8' },
    });
    const xml = builder.buildObject(obj);
    return xml;
};
*/ 
