import type { ChangeEvent } from "react";
import { Infinity, Sparkles } from "lucide-react";
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
  const hasName = name.trim().length > 0;
  const nameSizeClass = name.trim().length > 22 ? "name-field--long" :
    name.trim().length > 14 ? "name-field--medium" : "";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value);

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
          <span className="sr-only">اسم صاحب الإهداء</span>
          <input
            className={`name-field ${nameSizeClass}`}
            type="text"
            value={name}
            onChange={handleChange}
            maxLength={maxLength}
            placeholder="اكتب الاسم هنا"
            aria-label="اكتب اسمك أو اسم الشخص الذي تهديه الصفحة"
            autoComplete="off"
            autoCapitalize="words"
            dir="auto"
          />
        </label>
        <p className={`name-guidance ${hasName ? "name-guidance--filled" : ""}`}>
          {hasName ? "إهداء باسمك أو باسم من تحب" : "اسمك أو اسم شخص عزيز تهدي إليه ثواب القراءة"}
        </p>
        <div className="message-rule" aria-hidden="true"><span /></div>
        <div className="dedication-prayer-inline">
          <p className="dedication-message">اللهم تقبّل قراءتي، وهب مثل ثوابها</p>
          <p className="dedication-recipient">{hasName ? `إلى ${name.trim()}` : "لمن أهديتها إليه"}</p>
          <span className="dedication-recipient-note">حيًّا كان أو ميتًا</span>
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
