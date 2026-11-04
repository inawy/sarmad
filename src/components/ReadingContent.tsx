import {
  AYAT_AL_KURSI,
  BASMALAH,
  DHIKR_PHRASES,
  FORGIVENESS_DUA,
  GENERAL_DUA,
  HAWQALAH,
  IBRAHIMIYYAH,
  QURAN_PASSAGES,
  type QuranPassage,
} from "../data/readingContent";

function toArabicNumber(value: number): string {
  return String(value).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}

function QuranPassageView({ passage }: { passage: QuranPassage }) {
  return (
    <section className="reading-section quran-section" aria-labelledby={`heading-${passage.id}`}>
      <header className="reading-section-heading">
        <h2 id={`heading-${passage.id}`}>{passage.title}</h2>
        <span className="quran-reference">{passage.reference}</span>
      </header>

      {passage.basmala && (
        <p className="basmala quran-text" lang="ar">
          {BASMALAH}
        </p>
      )}

      <p className="quran-text" lang="ar" dir="rtl">
        {passage.verses.map((verse) => (
          <span className="ayah-fragment" key={verse.number}>
            {verse.text}
            <span className="ayah-number" aria-label={`الآية ${toArabicNumber(verse.number)}`}>
              {toArabicNumber(verse.number)}
            </span>
            {" "}
          </span>
        ))}
      </p>
    </section>
  );
}

export function ReadingContent() {
  return (
    <div className="reading-content" aria-label="نصوص للقراءة والدعاء">
      {QURAN_PASSAGES.map((passage) => (
        <QuranPassageView passage={passage} key={passage.id} />
      ))}

      <QuranPassageView passage={AYAT_AL_KURSI} />

      <section className="reading-section remembrance-section">
        <div className="remembrance-lines" lang="ar">
          {DHIKR_PHRASES.map((phrase) => (
            <p className="remembrance-line" key={phrase}>{phrase}</p>
          ))}
          <p className="remembrance-line hawqalah-line">{HAWQALAH}</p>
        </div>
      </section>

      <section className="reading-section dua-section">
        <h2 className="quiet-section-title">الصلاة على النبي ﷺ</h2>
        <p className="devotional-text" lang="ar">{IBRAHIMIYYAH}</p>
      </section>

      <section className="reading-section dua-section">
        <p className="devotional-text" lang="ar">{FORGIVENESS_DUA}</p>
        <p className="devotional-text" lang="ar">{GENERAL_DUA}</p>
      </section>
    </div>
  );
}
