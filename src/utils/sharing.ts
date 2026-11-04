import { toBlob } from "html-to-image";

const EXPORT_WIDTH = 864;
const EXPORT_HEIGHT = 1080;
const PDF_CONTENT_WIDTH = 718;

function safeFileBase(name: string): string {
  const safeName = name.trim()
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

function findCard(root: ParentNode = document): HTMLElement {
  const card = root.querySelector<HTMLElement>("[data-dedication-card]");
  if (!card) throw new Error("لم يتم العثور على بطاقة الإهداء.");
  return card;
}

function findPage(): HTMLElement {
  const page = document.querySelector<HTMLElement>("#sarmad-page");
  if (!page) throw new Error("لم يتم العثور على صفحة سرمد.");
  return page;
}

function prepareStaticCard(card: HTMLElement, name: string): void {
  card.querySelectorAll("[data-share-ui]").forEach((element) => element.remove());
  const input = card.querySelector<HTMLInputElement>(".name-field");
  const editor = card.querySelector<HTMLElement>(".name-editor");
  if (!input || !editor) throw new Error("تعذر تجهيز اسم الإهداء للتصدير.");
  const sizeClasses = Array.from(input.classList).filter((value) => value.startsWith("name-field--"));
  const staticName = document.createElement("div");
  staticName.className = ["name-field", "export-name-field", ...sizeClasses].join(" ");
  staticName.textContent = name.trim() || "شخص عزيز";
  staticName.setAttribute("dir", "auto");
  editor.replaceWith(staticName);
}

async function waitForFonts(): Promise<void> {
  if (!document.fonts) return;
  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('700 64px "Amiri"'),
    document.fonts.load('400 32px "Amiri"'),
    document.fonts.load('400 28px "Amiri Quran"'),
  ]);
}

export async function createDedicationPng(name: string): Promise<File> {
  const clone = findCard().cloneNode(true) as HTMLElement;
  prepareStaticCard(clone, name);
  clone.classList.add("dedication-card--export");
  clone.querySelector(".card-inner")?.classList.add("card-inner--export");
  const staging = document.createElement("div");
  staging.className = "sarmad-export-staging";
  staging.appendChild(clone);
  document.body.appendChild(staging);
  try {
    await waitForFonts();
    const blob = await toBlob(clone, {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      pixelRatio: 2,
      backgroundColor: "#fbfaf5",
      cacheBust: true,
      style: { width: `${EXPORT_WIDTH}px`, height: `${EXPORT_HEIGHT}px`, margin: "0", transform: "none" },
    });
    if (!blob) throw new Error("تعذر إنشاء صورة الإهداء.");
    return new File([blob], `${safeFileBase(name)}.png`, { type: "image/png" });
  } finally {
    staging.remove();
  }
}

export async function createDedicationPdf(name: string): Promise<File> {
  const clone = findPage().cloneNode(true) as HTMLElement;
  prepareStaticCard(findCard(clone), name);
  clone.classList.add("exporting-document");
  clone.querySelectorAll(".editing-note, [data-share-ui]").forEach((element) => element.remove());
  const staging = document.createElement("div");
  staging.className = "sarmad-pdf-staging";
  staging.appendChild(clone);
  document.body.appendChild(staging);
  try {
    await waitForFonts();
    const { default: html2pdf } = await import("html2pdf.js");
    const options = {
      margin: [8, 10, 12, 10] as [number, number, number, number],
      filename: `${safeFileBase(name)}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 1.45,
        width: PDF_CONTENT_WIDTH,
        windowWidth: PDF_CONTENT_WIDTH,
        useCORS: true,
        backgroundColor: "#f7f7f1",
        scrollY: 0,
        logging: false,
      },
      jsPDF: { unit: "mm", format: "a4" as const, orientation: "portrait" as const, compress: true },
      pagebreak: { mode: ["css", "legacy"], avoid: [".dedication-card", ".reading-section", ".sources-disclosure"] },
    };
    const blob = (await html2pdf().set(options).from(clone).outputPdf("blob")) as Blob;
    return new File([blob], `${safeFileBase(name)}.pdf`, { type: "application/pdf" });
  } finally {
    staging.remove();
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
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Use the selection-based fallback if clipboard permission is unavailable.
    }
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
  if (!copied) window.prompt("انسخ رابط الإهداء:", value);
}

export async function shareFileOrDownload(file: File, shareText: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const shareData = { files: [file], title: "إهداء من سرمد", text: shareText };
  const shareApi = navigator as unknown as {
    share?: (data: ShareData) => Promise<void>;
    canShare?: (data?: ShareData) => boolean;
  };
  let canShareFile = false;
  try {
    canShareFile = typeof shareApi.share === "function" &&
      typeof shareApi.canShare === "function" && shareApi.canShare({ files: [file] });
  } catch {
    canShareFile = false;
  }
  if (canShareFile && shareApi.share) {
    try {
      await shareApi.share(shareData);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
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
