import { useRef, type ChangeEvent } from "react";
import { Pencil } from "lucide-react";
import { ShareActions } from "./ShareActions";

type DedicationCardProps = {
  name: string;
  maxLength: number;
  onNameChange: (value: string) => void;
};

export function DedicationCard({ name, maxLength, onNameChange }: DedicationCardProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasName = name.trim().length > 0;
  const nameSizeClass = name.trim().length > 22 ? "name-field--long" :
    name.trim().length > 14 ? "name-field--medium" : "";

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => onNameChange(event.target.value);

  const focusName = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <article className="dedication-card" data-dedication-card aria-label="بطاقة الإهداء">
      <div className="card-inner">
        <p className="card-eyebrow">إهداء إلى</p>

        <label className="name-editor">
          <span className="sr-only">اسم الشخص المُهدى إليه</span>
          <textarea
            ref={inputRef}
            className={`name-field ${nameSizeClass}`}
            rows={1}
            wrap="off"
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

        {hasName && (
          <div className="name-guidance-row">
            <button className="name-edit-button" type="button" onClick={focusName}>
              <Pencil size={13} />
              <span>تغيير الاسم</span>
            </button>
          </div>
        )}

        <div className="dedication-prayer-inline">
          <p className="dedication-message">اللهم تقبّل قراءتي، وهب مثل ثوابها.</p>
        </div>

        <ShareActions name={name.trim()} />
      </div>
    </article>
  );
}
