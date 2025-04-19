import React from "react";
import "./download-pdf.css";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.default.vfs;

const badIcon =
  "http://localhost:3000/static/media/check-warning.34318c2601dee3edd8f29b465d9263b3.svg";
const okIcon =
  "http://localhost:3000/static/media/cross-good.a5af70085178dc2347df0f41363f3d38.svg";

function DownloadPdf({ isVisible, result }) {
  const date = () => {
    return new Date().toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const time = () => {
    return new Date().toLocaleTimeString("lt-LT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const generatePdf = async () => {
    const content = [
      {
        text: `Analizės rezultatas ${date()} ${time()}`,
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
      .download(`analizes rezultatas ${date()} ${time()}.pdf`);
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
