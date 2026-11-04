import { useState } from "react";
import {
  Copy,
  FileDown,
  ImageDown,
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

type ShareActionsProps = {
  name: string;
};

function isCancellation(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function ShareActions({ name }: ShareActionsProps) {
  const [busy, setBusy] = useState<ShareAction | null>(null);
  const [message, setMessage] = useState("");

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
          if (isCancellation(error)) {
            setMessage("تم إلغاء المشاركة.");
            return;
          }
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
      const result = await shareFileOrDownload(
        file,
        "بطاقة إهداء من سرمد.",
      );

      setMessage(
        result === "shared"
          ? "أصبحت صورة الإهداء جاهزة للمشاركة."
          : result === "downloaded"
            ? "تم تنزيل صورة الإهداء."
            : "تم إلغاء المشاركة.",
      );
    } catch {
      setMessage("تعذر إنشاء الصورة. حاول مرة أخرى.");
    } finally {
      setBusy(null);
    }
  };

  const sharePdf = async () => {
    setBusy("pdf");
    setMessage("");

    try {
      const file = await createDedicationPdf(name);
      const result = await shareFileOrDownload(
        file,
        "صفحة الإهداء كاملة من سرمد.",
      );

      setMessage(
        result === "shared"
          ? "أصبح ملف PDF جاهزًا للمشاركة."
          : result === "downloaded"
            ? "تم تنزيل ملف PDF."
            : "تم إلغاء المشاركة.",
      );
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

  const busyLabel = busy === "link"
    ? "جارٍ تجهيز الرابط…"
    : busy === "image"
      ? "جارٍ تجهيز الصورة…"
      : busy === "pdf"
        ? "جارٍ تجهيز PDF…"
        : "";

  return (
    <section className="share-actions" aria-labelledby="share-actions-title">
      <div className="share-actions-heading">
        <h2 id="share-actions-title">شارك الإهداء</h2>
        <p>احتفظ به أو أرسله لمن تحب</p>
      </div>

      <div className="share-actions-grid">
        <button
          className="share-action share-action--primary"
          type="button"
          onClick={shareLink}
          disabled={busy !== null}
        >
          {busy === "link"
            ? <LoaderCircle className="share-action-icon is-spinning" size={19} />
            : <Share2 className="share-action-icon" size={19} />}
          <span>مشاركة الرابط</span>
        </button>

        <button
          className="share-action"
          type="button"
          onClick={shareImage}
          disabled={busy !== null}
        >
          {busy === "image"
            ? <LoaderCircle className="share-action-icon is-spinning" size={19} />
            : <ImageDown className="share-action-icon" size={19} />}
          <span>مشاركة كصورة</span>
        </button>

        <button
          className="share-action"
          type="button"
          onClick={sharePdf}
          disabled={busy !== null}
        >
          {busy === "pdf"
            ? <LoaderCircle className="share-action-icon is-spinning" size={19} />
            : <FileDown className="share-action-icon" size={19} />}
          <span>مشاركة PDF كامل</span>
        </button>

        <button
          className="share-action"
          type="button"
          onClick={handlePrint}
          disabled={busy !== null}
        >
          <Printer className="share-action-icon" size={19} />
          <span>طباعة الصفحة</span>
        </button>
      </div>

      <p className="share-actions-note">
        الصورة لبطاقة الإهداء، وملف PDF يتضمن الصفحة كاملة.
      </p>

      <p className="share-actions-status" role="status" aria-live="polite">
        {busy ? busyLabel : message}
      </p>
    </section>
  );
}
