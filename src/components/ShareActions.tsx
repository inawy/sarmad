import { useEffect, useRef, useState } from "react";
import { Check, Copy, LoaderCircle, Share2 } from "lucide-react";
import { copyText, getCurrentShareUrl } from "../utils/sharing";
import { trackEvent } from "../utils/analytics";

type ShareActionsProps = { name: string };

function isCancellation(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function ShareActions({ name }: ShareActionsProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);
  const shareUrl = getCurrentShareUrl(name);

  useEffect(() => {
    setCopied(false);
    setMessage("");
  }, [shareUrl]);

  const copyShareLink = async () => {
    const success = await copyText(shareUrl);
    setCopied(success);
    setMessage(success ? "تم نسخ رابط الإهداء." : "حدّد الرابط وانسخه يدويًا.");

    if (success) {
      trackEvent("share_link_copied");
    } else {
      linkInputRef.current?.focus();
      linkInputRef.current?.select();
    }
  };

  const shareLink = async () => {
    setPanelOpen(true);
    setBusy(true);
    setCopied(false);
    setMessage("");
    trackEvent("share_link_generated");

    const recipient = name.trim();
    const shareData = {
      title: recipient ? `إهداء إلى ${recipient} | سرمد` : "سرمد | صفحة إهداء",
      text: recipient
        ? `صفحة إهداء إلى ${recipient}، فيها قراءة من القرآن وذكر ودعاء. افتح الرابط، ويمكنك تغيير الاسم ومشاركة نسختك.`
        : "صفحة إهداء من سرمد للقراءة والذكر والدعاء. افتح الرابط واكتب الاسم الذي تحب إهداء الصفحة إليه.",
      url: shareUrl,
    };

    const shareApi = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
    };

    try {
      if (typeof shareApi.share === "function") {
        try {
          await shareApi.share(shareData);
          trackEvent("share", { method: "native_share" });
          setMessage("تمت مشاركة الرابط.");
        } catch (error) {
          if (isCancellation(error)) {
            setMessage("تقدر تنسخ الرابط من هنا أو تشاركه لاحقًا.");
            return;
          }
          await copyShareLink();
        }
      } else {
        await copyShareLink();
      }
    } catch {
      setMessage("تعذرت مشاركة الرابط. انسخه من الحقل أدناه.");
      linkInputRef.current?.focus();
      linkInputRef.current?.select();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="share-actions" data-share-ui>
      <button
        className="share-trigger"
        type="button"
        onClick={() => void shareLink()}
        disabled={busy}
      >
        {busy
          ? <LoaderCircle className="is-spinning" size={18} />
          : <Share2 size={18} strokeWidth={1.8} />}
        <span>{busy ? "جارٍ تجهيز الرابط…" : "مشاركة الإهداء"}</span>
      </button>

      {panelOpen && (
        <div className="share-link-panel" aria-label="رابط الإهداء">
          <p className="share-link-title">رابط إهدائك جاهز</p>
          <p className="share-link-description">
            {name.trim()
              ? "الرابط يحمل الاسم الحالي. غيّر الاسم من البطاقة لتحديث الرابط."
              : "اكتب الاسم في البطاقة أولًا، وسيظهر في الرابط تلقائيًا."}
          </p>
          <div className="share-link-row">
            <input
              ref={linkInputRef}
              className="share-link-input"
              type="url"
              value={shareUrl}
              readOnly
              dir="ltr"
              aria-label="رابط الإهداء"
              onFocus={(event) => event.currentTarget.select()}
            />
            <button
              className="share-copy-button"
              type="button"
              onClick={() => void copyShareLink()}
              aria-label="نسخ رابط الإهداء"
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              <span>{copied ? "تم النسخ" : "نسخ الرابط"}</span>
            </button>
          </div>
          <p className="share-actions-status" role="status" aria-live="polite">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
