import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Printer,
  Share2,
} from "lucide-react";
import {
  copyText,
  createDedicationPdf,
  createDedicationPng,
  getCurrentShareUrl,
  printDedicationPage,
  shareFileOrDownload,
} from "../utils/sharing";

type ShareAction = "link" | "image" | "pdf" | "print";
type ShareActionsProps = { name: string };

function isCancellation(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function ShareActions({ name }: ShareActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState<ShareAction | null>(null);
  const [message, setMessage] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const shareLink = async () => {
    setBusy("link");
    setMessage("");
    const url = getCurrentShareUrl(name);
    const shareData = {
      title: name.trim() ? `إهداء إلى ${name.trim()} | سرمد` : "إهداء من سرمد",
      text: "صفحة إهداء وقراءة ودعاء من سرمد.",
      url,
    };
    try {
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          setMessage("تم فتح مشاركة الإهداء.");
        } catch (error) {
          if (isCancellation(error)) return;
          await copyText(url);
          setMessage("تعذرت المشاركة المباشرة؛ نُسخ الرابط بدلًا منها.");
        }
      } else {
        await copyText(url);
        setMessage("تم نسخ رابط الإهداء.");
      }
    } catch {
      setMessage("لم نتمكن من نسخ الرابط. حاول مرة أخرى.");
    } finally {
      setBusy(null);
    }
  };

  const shareImage = async () => {
    setBusy("image");
    setMessage("");
    try {
      const file = await createDedicationPng(name);
      const result = await shareFileOrDownload(file, "بطاقة إهداء من سرمد.");
      setMessage(result === "shared" ? "الصورة جاهزة للمشاركة." :
        result === "downloaded" ? "تم تنزيل صورة بطاقة الإهداء." : "");
    } catch {
      setMessage("تعذر تجهيز الصورة. حاول مرة أخرى.");
    } finally {
      setBusy(null);
    }
  };

  const sharePdf = async () => {
    setBusy("pdf");
    setMessage("");
    try {
      const file = await createDedicationPdf(name);
      const result = await shareFileOrDownload(file, "صفحة الإهداء كاملة من سرمد.");
      setMessage(result === "shared" ? "ملف PDF جاهز للمشاركة." :
        result === "downloaded" ? "تم تنزيل ملف PDF." : "");
    } catch {
      setMessage("تعذر تجهيز ملف PDF. جرّب الطباعة بدلًا منه.");
    } finally {
      setBusy(null);
    }
  };

  const handlePrint = () => {
    setMessage("");
    printDedicationPage();
  };

  const runAction = (action: ShareAction) => {
    setMenuOpen(false);
    if (action === "link") void shareLink();
    if (action === "image") void shareImage();
    if (action === "pdf") void sharePdf();
    if (action === "print") handlePrint();
  };

  const busyLabel = busy === "link" ? "جارٍ تجهيز الرابط…" :
    busy === "image" ? "جارٍ تجهيز الصورة…" :
      busy === "pdf" ? "جارٍ تجهيز PDF…" : "";

  return (
    <div className="share-actions" data-share-ui ref={rootRef}>
      <button
        className="share-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label="خيارات مشاركة الإهداء"
        onClick={() => { setMessage(""); setMenuOpen((open) => !open); }}
        disabled={busy !== null}
      >
        {busy ? <LoaderCircle className="is-spinning" size={18} /> : <Share2 size={18} strokeWidth={1.8} />}
        <span>{busy ? busyLabel : "مشاركة"}</span>
        {!busy && <ChevronDown className={menuOpen ? "share-chevron is-open" : "share-chevron"} size={15} />}
      </button>

      {menuOpen && (
        <div className="share-popover" role="menu" aria-label="طرق المشاركة">
          <button className="share-action" type="button" role="menuitem" onClick={() => runAction("link")}>
            <Share2 className="share-action-icon" size={18} /><span>مشاركة الرابط</span>
          </button>
          <button className="share-action" type="button" role="menuitem" onClick={() => runAction("image")}>
            <ImageIcon className="share-action-icon" size={18} /><span>صورة بطاقة الإهداء</span>
          </button>
          <button className="share-action" type="button" role="menuitem" onClick={() => runAction("pdf")}>
            <FileText className="share-action-icon" size={18} /><span>ملف PDF كامل</span>
          </button>
          <button className="share-action" type="button" role="menuitem" onClick={() => runAction("print")}>
            <Printer className="share-action-icon" size={18} /><span>طباعة الصفحة</span>
          </button>
        </div>
      )}
      <p className="share-actions-status" role="status" aria-live="polite">{busy ? busyLabel : message}</p>
    </div>
  );
}
