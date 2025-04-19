import React from "react";
import "./download-pdf.css";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.default.vfs;
function DownloadPdf({ isVisible, result, policyTitle, date, time }) {
  const generatePdf = async () => {
    const content = [
      {
        text: `Analizės rezultatas \n ${policyTitle} \n ${date} ${time}`,
        style: "header",
        margin: [0, 0, 0, 10],
      },
    ];

    result.forEach((category) => {
      content.push({
        text: category.category,
        style: "subheader",
        margin: [0, 10, 0, 5],
      });

      const itemRows = category.items.map((item) => {
        return [
          item.name,
          {
            text: item.answer === true ? "TAIP" : "NE",
            style: item.answer === true ? "badIcon" : "okIcon",
          },
        ];
      });

      content.push({
        table: {
          widths: ["*", 75],
          body: [["Klausimas", "Atsakymas"], ...itemRows],
        },
        layout: "lightHorizontalLines",
      });
    });

    const docDefinition = {
      content,
      defaultStyle: {
        font: "Roboto",
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
        },
        okIcon: {
          fontSize: 14,
          color: "green",
        },
        badIcon: {
          fontSize: 14,
          color: "red",
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`pp-analizes-rezultatas ${date} ${time}.pdf`);
  };
  return (
    <div className={`download-pdf ${isVisible ? "show" : ""}`}>
      <h3>Atsisiųskite sugeneruotą rezultatą</h3>
      <button type="button" onClick={() => generatePdf()}>
        Atsisiųsti
      </button>
    </div>
  );
}

export default DownloadPdf;
