import { toBlob } from "html-to-image";

const EXPORT_WIDTH = 864;
const EXPORT_HEIGHT = 1080;

function safeFileBase(name: string): string {
  const safeName = name
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 36);

  return safeName ? `sarmad-${safeName}` : "sarmad-gift";
}

function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}

function findCard(): HTMLElement {
  const card = document.querySelector<HTMLElement>("[data-dedication-card]");
  if (!card) throw new Error("لم يتم العثور على بطاقة الإهداء.");
  return card;
}

function findPage(): HTMLElement {
  const page = document.querySelector<HTMLElement>("#sarmad-page");
  if (!page) throw new Error("لم يتم العثور على صفحة سرمد.");
  return page;
}

export async function createDedicationPng(name: string): Promise<File> {
  const source = findCard();
  const clone = source.cloneNode(true) as HTMLElement;
  const input = clone.querySelector<HTMLInputElement>(".name-field");
  const editor = clone.querySelector<HTMLElement>(".name-editor");

  if (!input || !editor) throw new Error("تعذر تجهيز اسم الإهداء للصورة.");

  const staticName = document.createElement("div");
  staticName.className = `export-name-field ${input.className.replace("name-field", "")}`;
  staticName.textContent = name.trim() || "شخص عزيز";
  staticName.setAttribute("dir", "auto");
  editor.replaceWith(staticName);

  clone.classList.add("dedication-card--export");
  const inner = clone.querySelector<HTMLElement>(".card-inner");
  if (inner) inner.classList.add("card-inner--export");

  const staging = document.createElement("div");
  staging.className = "sarmad-export-staging";
  staging.appendChild(clone);
  document.body.appendChild(staging);

  try {
    if (document.fonts?.ready) await document.fonts.ready;
    const blob = await toBlob(clone, {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      pixelRatio: 1.25,
      backgroundColor: "#fbfaf5",
      cacheBust: true,
      style: {
        width: `${EXPORT_WIDTH}px`,
        height: `${EXPORT_HEIGHT}px`,
        margin: "0",
        transform: "none",
      },
    });

    if (!blob) throw new Error("تعذر إنشاء صورة الإهداء.");
    return new File([blob], `${safeFileBase(name)}.png`, { type: "image/png" });
  } finally {
    staging.remove();
  }
}

export async function createDedicationPdf(name: string): Promise<File> {
  const page = findPage();
  const { default: html2pdf } = await import("html2pdf.js");

  page.classList.add("exporting-document");
  try {
    if (document.fonts?.ready) await document.fonts.ready;

    const options = {
      margin: [10, 12, 12, 12] as [number, number, number, number],
      filename: `${safeFileBase(name)}.pdf`,
      image: { type: "jpeg" as const, quality: 0.96 },
      html2canvas: {
        scale: 1.7,
        useCORS: true,
        backgroundColor: "#f7f7f1",
        scrollY: 0,
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4" as const,
        orientation: "portrait" as const,
      },
      pagebreak: {
        mode: ["css", "legacy"],
        avoid: [".dedication-card", ".reading-section", ".sources-disclosure"],
      },
    };

    const blob = (await html2pdf().set(options).from(page).outputPdf("blob")) as Blob;
    return new File([blob], `${safeFileBase(name)}.pdf`, {
      type: "application/pdf",
    });
  } finally {
    page.classList.remove("exporting-document");
  }
}

export function downloadFile(file: File): void {
  downloadBlob(file, file.name);
}

export function printDedicationPage(): void {
  window.print();
}

export async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    window.prompt("انسخ رابط الإهداء:", value);
  }
}

export async function shareFileOrDownload(
  file: File,
  shareText: string,
): Promise<"shared" | "downloaded" | "cancelled"> {
  const shareData = { files: [file], title: "إهداء من سرمد", text: shareText };

  if (
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share(shareData);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
      // Fall through to a regular file download when native sharing fails.
    }
  }

  downloadFile(file);
  return "downloaded";
}

export function getCurrentShareUrl(name: string): string {
  const url = new URL(window.location.href);
  const safeName = name.trim();

  if (safeName) url.searchParams.set("to", safeName);
  else url.searchParams.delete("to");

  return url.toString();
}
