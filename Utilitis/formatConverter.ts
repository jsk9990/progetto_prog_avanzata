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
    const doc = new PDFDocument();
    let buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        return pdfData;
    });

    // Aggiungi qui il contenuto del PDF, ad esempio:
    doc.text(JSON.stringify(data, null, 2));

    doc.end();

    // Poiché PDFKit è asincrono, dobbiamo restituire una Promise
    return new Promise((resolve, reject) => {
        doc.on('finish', () => {
            resolve(Buffer.concat(buffers));
        });
        doc.on('error', reject);
    });
};


// utils/convertToXML.ts
import { Builder } from 'xml2js';

export const convertToXML = (data: any[]): string => {
    const builder = new Builder();
    const xml = builder.buildObject({ aggiornamenti: data });
    return xml;
};
