import PdfPrinter from 'pdfmake';
import * as fs from 'fs';
import * as path from 'path';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

interface StudentData {
   name: string;
   last_name: string;
   dni: number;
   phone: number;
   record_number: number;
   sede: string;
   salon: string;
   turn: string;
}

// Definir las fuentes
const fonts = {
   Roboto: {
      normal: path.join(__dirname, '../../fonts/Roboto-Regular.ttf'),
      bold: path.join(__dirname, '../../fonts/Roboto-Medium.ttf'),
      italics: path.join(__dirname, '../../fonts/Roboto-Italic.ttf'),
      bolditalics: path.join(__dirname, '../../fonts/Roboto-MediumItalic.ttf'),
   },
};

// Función para generar el contenido A5
function getA5ContentWithHeaderFooter(student: StudentData, logoBase64: string) {
   const header = {
      columns: [
         {
            image: 'data:image/png;base64,' + logoBase64,
            width: 40,
            margin: [0, 15, 0, 0],
         },
         {
            text: 'CENTRO DE ESTUDIOS PRE UNIVERSITARIO',
            style: 'title',
            alignment: 'center',
            margin: [0, 15, 0, 0],
         },
         {
            width: 40,
            text: '',
         },
      ],
      margin: [0, 0, 0, 5],
   };

   const footer = {
      columns: [
         { text: 'Dirección: Calle Ficticia 123 - Tel: 555-1234', alignment: 'left', fontSize: 9, margin: [10, 10, 0, 0] },
         { text: 'www.centroejemplo.edu', alignment: 'right', fontSize: 9, margin: [0, 10, 10, 0] }
      ],
      margin: [0, 10, 0, 0],
   };

   const content = [
      { text: `Inscripción - EXP: N° ${student.record_number}`, style: 'header' },
      { text: 'Datos del Alumno', style: 'title' },
      { text: `Nombre: ${student.name}`, style: 'data' },
      { text: `Apellido: ${student.last_name}`, style: 'data' },
      { text: `DNI: ${student.dni}`, style: 'data' },
      { text: `Celular: ${student.phone}`, style: 'data' },
      { text: 'Información académica', style: 'title' },
      { text: `Sede: ${student.sede}`, style: 'data' },
      { text: `Salón: ${student.salon}`, style: 'data' },
      { text: `Turno: ${student.turn}`, style: 'data' },
   ];

   return {
      table: {
         widths: ['*'],
         body: [
            [header],
            [
               {
                  stack: content,
                  margin: [10, 0, 0, 0],
               },
            ],
            [footer],
         ],
         heights: [
            60,
            415.28,
            60,
         ],
      },
      margin: [10, 10, 10, 0],
      layout: {
         hLineWidth: function (i: number, node: any) {
            return (i === 0 || i === node.table.body.length) ? 1 : 0;
         },
         vLineWidth: function (i: number, node: any) {
            return (i === 0 || i === node.table.widths.length) ? 1 : 0;
         },
         hLineColor: () => '#444',
         vLineColor: () => '#444',
      },
   };
}

// Función para generar el PDF A4 con dos copias del contenido A5
export async function generateStudentPDF(student: StudentData): Promise<Buffer> {
   const printer = new PdfPrinter(fonts);
   const logoBase64 = fs.readFileSync(path.join(__dirname, '../assets/CEPU.png')).toString('base64');

   const a5Content1 = getA5ContentWithHeaderFooter(student, logoBase64);
   const a5Content2 = getA5ContentWithHeaderFooter(student, logoBase64);

   const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      content: [
         {
            columns: [
               {
                  width: '50%',
                  ...a5Content1,
                  margin: [0, 0, 15, 0],
               },
               {
                  width: '50%',
                  ...a5Content2,
                  margin: [15, 0, 0, 0],
               },
            ],
         },
      ],
      styles: {
         header: {
            fontSize: 16,
            alignment: 'center',
            margin: [0, 0, 0, 10],
            bold: true,
         },
         title: {
            fontSize: 14,
            bold: true,
            color: '#003366',
         },
         data: {
            fontSize: 12,
            alignment: 'left',
            margin: [0, 5, 0, 5],
         },
      },
      defaultStyle: {
         font: 'Roboto',
      },
   };

   const pdfDoc = printer.createPdfKitDocument(docDefinition);

   return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);

      pdfDoc.end();
   });
}