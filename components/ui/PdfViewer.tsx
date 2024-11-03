import React from "react";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  console.log("Pdf",pdf_url)
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
      className="w-full h-full"
      allowFullScreen
    ></iframe>
  );
};

export default PDFViewer;