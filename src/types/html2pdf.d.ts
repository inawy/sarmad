declare module "html2pdf.js" {
  type Html2PdfOptions = {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: { type?: "jpeg" | "png" | "webp"; quality?: number };
    html2canvas?: Record<string, unknown>;
    jsPDF?: Record<string, unknown>;
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
  };

  interface Html2PdfWorker {
    set(options: Html2PdfOptions): Html2PdfWorker;
    from(element: HTMLElement): Html2PdfWorker;
    outputPdf(type: "blob"): Promise<Blob>;
  }

  function html2pdf(): Html2PdfWorker;
  export default html2pdf;
}
