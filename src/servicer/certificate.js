const pdfmake = require("pdfmake");
const path = require("path");
const { uploadcloudinary } = require("./cloudinary");

const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// NEW Modern Color Palette
const NAVY = '#1a2a3a';
const GOLD = '#c5a059';
const SLATE = '#f4f4f4';
const TEXT_GREY = '#555555';

const fonts = {
    Roboto: {
        normal: './public/fonts/Roboto-Regular.ttf',
        bold: './public/fonts/Roboto-Medium.ttf',
        italics: './public/fonts/Roboto-Italic.ttf',
        bolditalics: './public/fonts/Roboto-MediumItalic.ttf'
    }
};

pdfmake.addFonts(fonts);

const createCertificate = async ({ username, courseName, grade, issueDate }) => {
    const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape', // Changed to landscape for a modern certificate feel
        pageMargins: [0, 0, 0, 0],

        background: {
            canvas: [
                { type: 'rect', x: 0, y: 0, w: 842, h: 595, color: '#ffffff' }, // Full white background
                { type: 'rect', x: 0, y: 0, w: 200, h: 595, color: NAVY }        // Sidebar branding
            ]
        },

        content: [
            {
                table: {
                    widths: [200, '*'],
                    body: [[
                        // SIDEBAR CONTENT
                        {
                            stack: [
                                { text: 'CERTIFIED', fontSize: 24, color: 'white', bold: true, margin: [20, 100, 0, 5] },
                                { text: 'ACHIEVEMENT', fontSize: 18, color: GOLD, margin: [20, 0, 0, 20] },
                                { canvas: [{ type: 'line', x1: 20, y1: 0, x2: 120, y2: 0, lineWidth: 2, lineColor: GOLD }] }
                            ],
                            border: [false, false, false, false]
                        },
                        // MAIN CONTENT
                        {
                            margin: [50, 80, 50, 0],
                            stack: [
                                { text: 'ELEVELT KNOWLEDGE', color: '#aaaaaa', fontSize: 10, characterSpacing: 2 },
                                { text: 'Certificate of Excellence', fontSize: 32, bold: true, color: NAVY, margin: [0, 10, 0, 40] },
                                { text: 'This is to certify that', fontSize: 14, color: TEXT_GREY },
                                { text: username, fontSize: 40, bold: true, color: NAVY, margin: [0, 10, 0, 10] },
                                { text: 'has successfully completed the course', fontSize: 14, color: TEXT_GREY },
                                { text: courseName.toUpperCase(), fontSize: 22, bold: true, color: GOLD, margin: [0, 10, 0, 40] },
                                {
                                    columns: [
                                        { stack: [{ text: 'GRADE', fontSize: 8, color: '#aaa' }, { text: grade, fontSize: 20, bold: true, color: NAVY }] },
                                        { stack: [{ text: 'DATE', fontSize: 8, color: '#aaa' }, { text: formatDate(issueDate), fontSize: 14, color: NAVY }] }
                                    ]
                                }
                            ],
                            border: [false, false, false, false]
                        }
                    ]]
                },
                layout: 'noBorders'
            }
        ]
    };

    const pdf = pdfmake.createPdf(docDefinition);
    const filePath = path.join(__dirname, `../temp/${Date.now()}.pdf`);
    await pdf.write(filePath);
    console.log('filePath', filePath);


    const result = await uploadcloudinary(filePath, 'certificates');

    console.log("result", result);
    return result.url
};

module.exports = createCertificate;