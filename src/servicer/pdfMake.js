const { text } = require("express");
const pdfmake = require("pdfmake");
const { Body } = require("twilio/lib/twiml/MessagingResponse");

const creatPdf = () => {
    try {
        // Define font files
        const fonts = {
            Roboto: {
                normal: "./public/fonts/Roboto-Regular.ttf",
                bold: "./public/fonts/Roboto-Bold.ttf",
                italics: "./public/fonts/Roboto-Italic.ttf",
                bolditalics: "./public/fonts/Roboto-BoldItalic.ttf",
            },
        };

        pdfmake.addFonts(fonts);

        // const docDefinition = {
        //     content: [
        //         {
        //             columns: [
        //                 {
        //                     stack: [
        //                         {
        //                             image: './public/Images/Amazon_logo.png',
        //                             width: 164,
        //                             height: 50,
        //                         },
        //                     ]
        //                 },
        //                 {
        //                     width: 'auto',
        //                     stack: [
        //                         { text: 'Tax Invoice/Bill of Supply/Cash Memo', style: 'normalText',bold: true, alignment: 'right' },
        //                         { text: `(Original for Recipient)`, style: 'normalText', alignment: 'right' }
        //                     ]
        //                 }
        //             ],
        //             margin: [0, 0, 0, 20]
        //         },

        //         {
        //             columns: [
        //                 {
        //                     width: '50%',
        //                     stack: [
        //                         { text: 'Sold By:', bold: true, },
        //                         { text: "harsh", },
        //                         { text: "c-604 Saral Green Velly", },
        //                         { text: "Surat", },
        //                         { text: 'India', style: 'normalText', margin: [0, 5, 0, 0] }
        //                     ]
        //                 },
        //                 {
        //                     width: '50%',
        //                     stack: [
        //                         { text: 'Billing Address:', bold: true, style: 'normalText', alignment: 'right' },
        //                         { text: "harsh", style: 'normalText', alignment: 'right' },
        //                         { text: "c-604 Saral Green Velly", style: 'normalText', alignment: 'right' },
        //                         { text: "Surat", style: 'normalText', alignment: 'right' }
        //                     ]
        //                 }
        //             ],
        //             margin: [0, 0, 0, 15]
        //         },

        //         // Shipping Address
        //         {
        //             columns: [
        //                 {
        //                     width: '50%',
        //                     stack: [
        //                         { text: 'PAN NO : EPcfe02465', },
        //                         { text: 'GST Registration NO : 27AABCCDDEEFFGGH', },
        //                         { text: 'Order Number: 405-0419869-0333924', },
        //                         { text: "Order Date: 28.01.2025", style: 'normalText', margin: [0, 0, 0, 5] },

        //                     ]
        //                 },
        //                 {
        //                     width: '50%',
        //                     stack: [
        //                         { text: 'Shipping Address:', style: 'normalText',bold: true, alignment: 'right' },
        //                         { text: "harsh", style: 'normalText', alignment: 'right' },
        //                         { text: "c-604 Saral Green Velly", style: 'normalText', alignment: 'right' },
        //                         { text: "Surat", style: 'normalText', alignment: 'right' },
        //                         { text: 'Invoice Number: IN-803 ', , alignment: 'right' },
        //                         { text: 'Invoice Date: 28.01.2025', , alignment: 'right' },
        //                     ],
        //                     margin: [0, 0, 0, 20]
        //                 },
        //             ],
        //             margin: [0, 0, 0, 20]
        //         },

        //     ]
        // };

        const docDefinition = {
            content: [
                {
                    columns: [
                        {
                            image: "./public/Images/Amazon_logo.png",
                            width: 164,
                            height: 50,
                        },

                        {
                            stack: [
                                {
                                    text: "Tax Invoice/Bill of Supply/Cash Memo",
                                    bold: true,
                                    alignment: "right",
                                },
                                { text: "(Original for Recipient)", alignment: "right" },
                            ],
                        },
                    ],
                    margin: [0, 0, 0, 20],
                },

                {
                    columns: [
                        {
                            alignment: "justify",
                            stack: [
                                { text: "Sold By: ", bold: true },
                                { text: "SUPER MARKETING" },
                                { text: "* Super Marketinrg Agency, Plot No. 613, Sumer" },
                                { text: "Nagar Main, Nea, r Gagan Bharti School," },
                                { text: "Mansarovar Jaipur - 302020" },
                                { text: "JAIPUR, RAJASTHAN, 302020" },
                                { text: "IN" },
                            ],
                        },
                        {
                            stack: [
                                { text: "Billing Address: ", bold: true, alignment: "right" },
                                {
                                    text: "Ankitkumar Navinbhai dharsandiya",
                                    alignment: "right",
                                },
                                {
                                    text: "A1 402, Opera palm, Kholvad Road",
                                    alignment: "right",
                                },
                                { text: "SURAT, GUJARAT, 394185", alignment: "right" },
                                { text: "IN", alignment: "right" },
                                {
                                    text: [
                                        { text: "State/UT Code: ", bold: true, alignment: "right" },
                                        { text: "24", alignment: "right" },
                                    ],
                                },
                            ],
                        },
                    ],
                    margin: [0, 0, 0, 15],
                },
                {
                    columns: [
                        {
                            alignment: "justify",
                            stack: [
                                {
                                    text: [
                                        { text: "PAN NO: ", bold: true },
                                        { text: "EPSPK8990C" },
                                    ],
                                    text: [
                                        { text: "GST Registration No: ", bold: true },
                                        { text: "08EPSPK8990C1Z5" },
                                    ],
                                },
                            ],
                        },
                        {
                            stack: [
                                { text: "Shipping Address :", bold: true, alignment: "right" },
                                {
                                    text: "Ankitkumar Navinbhai dharsandiya",
                                    alignment: "right",
                                },
                                {
                                    text: "Ankitkumar Navinbhai dharsandiya",
                                    alignment: "right",
                                },
                                {
                                    text: "A1 402, Opera palm, Kholvad Road",
                                    alignment: "right",
                                },
                                { text: "SURAT, GUJARAT, 394185", alignment: "right" },
                                { text: "IN", alignment: "right" },
                                {
                                    text: [
                                        { text: "State/UT Code: ", bold: true, alignment: "right" },
                                        { text: "24", alignment: "right" },
                                    ],
                                },
                                {
                                    text: [
                                        {
                                            text: "Place of supply: ",
                                            bold: true,
                                            alignment: "right",
                                        },
                                        { text: "GUJARAT", alignment: "right" },
                                    ],
                                },
                                {
                                    text: [
                                        {
                                            text: "Place of delivery: ",
                                            bold: true,
                                            alignment: "right",
                                        },
                                        { text: "GUJARAT", alignment: "right" },
                                    ],
                                },
                            ],
                        },
                    ],
                    margin: [0, 0, 0, 5],
                },
                {
                    columns: [
                        {
                            alignment: "justify",
                            stack: [
                                {
                                    text: [
                                        { text: "Order Number: ", bold: true },
                                        { text: "405-0419869-0333924" },
                                    ],
                                    text: [
                                        { text: "Order Date:  ", bold: true },
                                        { text: "28.01.2025" },
                                    ],
                                },
                            ],
                        },
                        {
                            stack: [
                                {
                                    text: [
                                        {
                                            text: "Invoice Number : ",
                                            bold: true,
                                            alignment: "right",
                                        },
                                        { text: "IN-803", alignment: "right" },
                                    ],
                                },
                                {
                                    text: [
                                        {
                                            text: "Invoice Details :",
                                            bold: true,
                                            alignment: "right",
                                        },
                                        { text: "RJ-315637153-2425", alignment: "right" },
                                    ],
                                },
                                {
                                    text: [
                                        { text: "Invoice Date : ", bold: true, alignment: "right" },
                                        {
                                            text: "28.01.2025",
                                            alignment: "right",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    margin: [0, 0, 0, 5],
                },
                {
                    style: "billTable",
                    table: {
                        body: [
                            [
                                { text: "Sl.No", fillColor: "#d9d9d9" },
                                { text: "Product Name", fillColor: "#d9d9d9" },
                                { text: "Unit Price", fillColor: "#d9d9d9" },
                                { text: "Qty", fillColor: "#d9d9d9" },
                                { text: "Net Amount", fillColor: "#d9d9d9" },
                                { text: "Tax Rate", fillColor: "#d9d9d9" },
                                { text: "Tax Type", fillColor: "#d9d9d9" },
                                { text: "Tax Amount", fillColor: "#d9d9d9" },
                                { text: "Total Amount", fillColor: "#d9d9d9" },
                            ],
                            [
                                { text: "1", border: [true, true, true, false] },
                                {
                                    text: "Google Review NFC Card Along with QR Code | Tap or Scan for \n Reviews/Feedback | PVC Card with UV Print | Pre-Printed Multicolored \n | B0CYD64SY3 ( GRC1001 ) \n HSN:5201",
                                    border: [true, true, true, false],
                                },
                                { text: "₹117.80", border: [true, true, true, false] },
                                { text: "2", border: [true, true, true, false] },
                                { text: "₹235.60", border: [true, true, true, false] },
                                { text: "18%", border: [true, true, true, false] },
                                { text: "IGST", border: [true, true, true, false] },
                                { text: "₹42.40", border: [true, true, true, false] },
                                { text: "₹278.00", border: [true, true, true, false] },
                            ],
                            [
                                { text: "", border: [true, false, true, true] },
                                { text: "Shipping Charges", border: [true, false, true, true] },
                                { text: "₹33.90", border: [true, false, true, true] },
                                { text: "", border: [true, false, true, true] },
                                { text: "₹67.80", border: [true, false, true, true] },
                                { text: "18%", border: [true, false, true, true] },
                                { text: "IGST", border: [true, false, true, true] },
                                { text: "₹12.20 ", border: [true, false, true, true] },
                                { text: "₹80.00", border: [true, false, true, true] },
                            ],
                              [
                                { text: "TOTAL: ", bold: true, colSpan: 7 },
                                '','','','','','',
                                { text: "₹54.60", fillColor: "#d9d9d9" },
                                { text: "₹358.00", fillColor: "#d9d9d9" },
                              ],
                              [
                                { text: "Amount in Words:", bold: true, colSpan: 9 , border: [true, true, true, false]},
                                '','','','','','','','',
                              ],
                              [ 
                                { text: "Three Hundred Fifty-eight only", colSpan: 9 , border: [true, false, true, true]},
                                '','','','','','','','',
                              ],
                            [
                                { text: "For SUPER MARKETING: ", bold: true, colSpan: 9, border: [true, true, true, false], alignment: 'right' },
                                '','','','','','','','',
                            ],
                            [
                                { image: './public/Images/signature.png',width: 80, height:30, alignment: 'right',  colSpan: 9 , border: [true, true, true, false]},
                                '','','','','','','','',
                            ],
                            [ 
                                { text: 'Authorized Signatory', bold: true, colSpan: 9, alignment: 'right' },
                                '','','','','','','','',
                            ]
                        ],
                    },
                },
                {
                    text: "Whether tax is payable under reverse charge - No."
                },
                {
                    style: "paymentinfoTable",
                    table: {
                        body: [
                            [
                                {
                                    text: [
                                        { text: "Payment Transaction ID: ", bold: true },
                                        { text: "1112wwZD1UzLIjSf7OFM9Vqkv" }
                                    ]
                                },
                                {
                                    text: [
                                        { text: "Date & Time:  ", bold: true },
                                        { text: "28/01/2025, 19:09:00 hrs" }
                                    ]
                                },
                                {
                                    text: [
                                        { text: "Invoice Value:", bold: true, colSpan: 2, border: [true, true, true, false] },
                                        { text: "₹358.00", border: [true, true, true, false] }
                                    ]
                                },
                                {
                                    text: [
                                        { text: "Mode of Payment: ", bold: true },
                                        { text: "AmazonPay" }
                                    ]
                                }
                            ],
                            [
                                {
                                    text: [
                                        { text: "Payment Transaction ID: ", bold: true },
                                        { text: "1112wwZD1UzLIjSf7OFM9Vqkv" }
                                    ]
                                },
                                {
                                    text: [
                                        { text: "Date & Time:  ", bold: true },
                                        { text: "28/01/2025, 19:09:00 hrs" }
                                    ]
                                },
                                {
                                    text: '', border: [true, false, true, true]
                                },
                                {
                                    text: [
                                        { text: "Mode of Payment:", bold: true },
                                        { text: "GiftCard" }
                                    ]
                                }
                            ]
                        ]
                    }
                },
                {
                    text: "*ASSPL-Amazon Seller Services Pvt. Ltd., ARIPL-Amazon Retail India Pvt. Ltd. (only where Amazon Retail India Pvt. Ltd. fulfillment center is co-located)", color: 'gray', fontSize: 6, alignment: 'center', margin: [0, 6, 0, 0]
                },
                {
                    text: "Customers desirous of availing input GST credit are requested to create a Business account and purchase on Amazon.in/business from Business eligible offers ", color: 'gray', fontSize: 6, alignment: 'center', margin: [0, 6, 0, 0]
                },
                {
                    text: "Please note that this invoice is not a demand for payment", color: 'gray', fontSize: 6, alignment: 'center' , margin: [0, 6, 0, 0]
                },
                {
                    text: "Page 1 of 1", color: 'gray', fontSize: 6, alignment: 'right'
                }
            ]
        };

        const pdf = pdfmake.createPdf(docDefinition);

        pdf.write("bill.pdf").then(
            () => {
                // success event
            },
            (err) => {
                // error event
                console.error(err);
            },
        );
    } catch (error) {
        console.log(error);
    }
};

module.exports = creatPdf;
