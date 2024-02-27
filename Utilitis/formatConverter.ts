// utils/writeCSV.ts
import { Parser } from 'json2csv';

export const writeCSV = (data: any[]): string => {
    const parser = new Parser();
    const csv = parser.parse(data);
    return csv;
};


// utils/generatePDF.ts
import PDFDocument from 'pdfkit';

export const generatePDF = (data: any[]): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
    
        const doc = new PDFDocument();
        let buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            resolve (pdfData);
        });

        doc.on ('error', reject);

        // Aggiungi qui il contenuto del PDF, ad esempio:
        doc.text(JSON.stringify(data, null, 2));

        doc.end();

    // Poiché PDFKit è asincrono, dobbiamo restituire una Promise
    });  

};


// utils/convertToXML.ts
import json2xml from 'json2xml';


export const convertToXML = (data: any[]): string => {
    // Assicurati che i dati siano strutturati correttamente per la conversione in XML
    const obj = {
        aggiornamento: data // 'aggiornamento' è l'elemento che racchiude ogni oggetto nell'array
    };

    // Converti l'oggetto JSON in una stringa XML
    const xml = json2xml(obj);
    return xml;
};





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