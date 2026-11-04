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

type ReadingContentProps = {
  dedicationName: string;
};

function toArabicNumber(value: number): string {
  return String(value).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}

function QuranPassageView({ passage }: { passage: QuranPassage }) {
  return (
    <section className="reading-section quran-section" aria-labelledby={`heading-${passage.id}`}>
      <header className="reading-section-heading">
        <h2 id={`heading-${passage.id}`}>{passage.title}</h2>
        <a
          className="quran-reference"
          href={passage.sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`مراجعة ${passage.title} في المصحف`}
        >
          {passage.reference}
        </a>
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

function SourceDisclosure() {
  return (
    <details className="sources-disclosure">
      <summary>عن النصوص والمصادر</summary>
      <div className="sources-body">
        <p>
          الآيات معروضة بالرسم العثماني وفق رواية حفص. روجعت نصوص السور عبر صفحات
          المصحف في Quran.com، ويُستأنس ببيانات حفص Unicode التي يتيحها مجمع الملك
          فهد لطباعة المصحف الشريف للمطورين. يُرجى الرجوع إلى المصحف عند أي اختلاف
          في طريقة عرض الخط أو العلامات.
        </p>

        <ul>
          <li>
            <a href="https://qurancomplex.gov.sa/quran-dev/" target="_blank" rel="noreferrer">
              مجمع الملك فهد — بيانات القرآن بالرسم العثماني ورواية حفص
            </a>
          </li>
          <li>
            <a href="https://quran.com/ar/al-fatihah" target="_blank" rel="noreferrer">الفاتحة</a>
            {" · "}
            <a href="https://quran.com/ar/an-nas" target="_blank" rel="noreferrer">الناس</a>
            {" · "}
            <a href="https://quran.com/ar/al-falaq" target="_blank" rel="noreferrer">الفلق</a>
            {" · "}
            <a href="https://quran.com/ar/al-ikhlas" target="_blank" rel="noreferrer">الإخلاص</a>
            {" · "}
            <a href="https://quran.com/ar/al-kafirun" target="_blank" rel="noreferrer">الكافرون</a>
            {" · "}
            <a href="https://quran.com/ar/al-baqarah/255" target="_blank" rel="noreferrer">آية الكرسي</a>
          </li>
        </ul>

        <p>
          التسبيح والتحميد والتهليل والتكبير واردة في صحيح مسلم (٢١٣٧)، والحوقلة
          في صحيح البخاري (٦٣٨٤) وصحيح مسلم (٢٧٠٤). والصلاة الإبراهيمية مروية في
          صحيح البخاري (٣٣٧٠).
        </p>
        <ul>
          <li>
            <a href="https://dorar.net/h/HXVwMxNV?osoul=1" target="_blank" rel="noreferrer">
              صحيح مسلم — الكلمات الأربع
            </a>
          </li>
          <li>
            <a href="https://dorar.net/h/vfqk0U79?osoul=1" target="_blank" rel="noreferrer">
              صحيح البخاري — الحوقلة
            </a>
          </li>
          <li>
            <a href="https://sunnah.com/bukhari:3370" target="_blank" rel="noreferrer">
              صحيح البخاري — الصلاة الإبراهيمية
            </a>
          </li>
        </ul>

        <p>
          دعاء المغفرة والدعاء الجامع المعروضان هنا صيغ دعاء عامة، ولا ننسبهما
          بلفظهما إلى حديث نبوي. وإهداء ثواب القراءة معروض على أنه دعاء جائز وفق
          فتوى دار الإفتاء المصرية، مع وجود خلاف فقهي معروف في المسألة.
        </p>
        <ul>
          <li>
            <a href="https://www.dar-alifta.org/ar/fatwa/details/14805/هبة-ثواب-تلاوة-القرآن-للأحياء" target="_blank" rel="noreferrer">
              دار الإفتاء المصرية — هبة ثواب التلاوة للأحياء (٤٦٢٨)
            </a>
          </li>
          <li>
            <a href="https://dar-alifta.org/ar/fatwa/details/13016/حكم-قراءة-القرآن-على-القبر-ووصول-ثوابه-للميت" target="_blank" rel="noreferrer">
              دار الإفتاء المصرية — وصول ثواب القراءة للميت (٢١٤٢)
            </a>
          </li>
        </ul>

        <p className="sources-note">
          لا تحدد هذه الصفحة عددًا أو وقتًا للتكرار، ولا تعرض ترتيب النصوص بوصفه
          سنة نبوية مخصوصة أو وردًا لازمًا.
        </p>
      </div>
    </details>
  );
}

export function ReadingContent({ dedicationName }: ReadingContentProps) {
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

      <section className="dedication-prayer" aria-label="دعاء الإهداء">
        <p>اللَّهُمَّ تَقَبَّلْ قِرَاءَتِي، وَهَبْ مِثْلَ ثَوَابِهَا</p>
        <p>
          {dedicationName
            ? `إِلَى ${dedicationName.trim()}.`
            : "لِمَنْ أَهْدَيْتُهَا إِلَيْهِ."}
        </p>
        <span>حَيًّا كَانَ أَوْ مَيِّتًا</span>
      </section>

      <SourceDisclosure />
    </div>
  );
}
