import { useRef, type ChangeEvent } from "react";
import { Infinity, Pencil, Sparkles } from "lucide-react";
import { ShareActions } from "./ShareActions";

type DedicationCardProps = {
  name: string;
  maxLength: number;
  onNameChange: (value: string) => void;
};

function CardDivider() {
  return (
    <div className="card-divider" aria-hidden="true">
      <span /><Sparkles size={15} strokeWidth={1.35} /><span />
    </div>
  );
}

export function DedicationCard({ name, maxLength, onNameChange }: DedicationCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasName = name.trim().length > 0;
  const nameSizeClass = name.trim().length > 22 ? "name-field--long" :
    name.trim().length > 14 ? "name-field--medium" : "";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value);

  const focusName = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <article className="dedication-card" data-dedication-card aria-label="بطاقة الإهداء">
      <div className="card-inner">
        <div className="card-top-mark" aria-hidden="true">
          <span className="mark-line" />
          <span className="mark-center"><Infinity size={23} strokeWidth={1.35} /></span>
          <span className="mark-line" />
        </div>
        <p className="card-eyebrow">إِهْدَاء</p>
        <CardDivider />
        <p className="to-word">إلى</p>
        <label className="name-editor">
          <span className="sr-only">اسم الشخص المُهدى إليه</span>
          <input
            ref={inputRef}
            className={`name-field ${nameSizeClass}`}
            type="text"
            value={name}
            onChange={handleChange}
            maxLength={maxLength}
            placeholder="اسم الشخص المُهدى إليه"
            aria-label="اكتب اسم الشخص الذي تهديه الصفحة"
            autoComplete="off"
            autoCapitalize="words"
            dir="auto"
          />
        </label>

        <div className="name-guidance-row">
          <p className={`name-guidance ${hasName ? "name-guidance--filled" : ""}`}>
            {hasName
              ? "الرابط مخصص بهذا الاسم، ويمكنك تغييره."
              : "اكتب اسمك أو اسم شخص تحبه."}
          </p>
          {hasName && (
            <button className="name-edit-button" type="button" onClick={focusName}>
              <Pencil size={13} />
              <span>تغيير الاسم</span>
            </button>
          )}
        </div>

        <div className="message-rule" aria-hidden="true"><span /></div>
        <div className="dedication-prayer-inline">
          <p className="dedication-message">اللهم تقبّل قراءتي، وهب مثل ثوابها.</p>
        </div>
        <div className="card-footer">
          <span className="footer-flourish" aria-hidden="true"><Infinity size={19} strokeWidth={1.4} /></span>
          <span>سَرْمَد</span>
          <span className="footer-caption">إهداء بمحبة</span>
        </div>
        <ShareActions name={name.trim()} />
      </div>
    </article>
  );
}
