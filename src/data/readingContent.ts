export type QuranVerse = {
  number: number;
  text: string;
};

export type QuranPassage = {
  id: string;
  title: string;
  reference: string;
  sourceUrl: string;
  basmala?: boolean;
  verses: QuranVerse[];
};

/**
 * Qur'anic text is displayed in Uthmani script (Hafs).
 * Keep verse text separate from headings and basmalah.
 * Do not normalize or edit these strings without Mushaf review.
 */
export const BASMALAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

export const QURAN_PASSAGES: QuranPassage[] = [
  {
    id: "al-fatihah",
    title: "الفاتحة",
    reference: "١",
    sourceUrl: "https://quran.com/ar/al-fatihah",
    verses: [
      { number: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ" },
      { number: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ" },
      { number: 3, text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ" },
      { number: 4, text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ" },
      { number: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
      { number: 6, text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ" },
      { number: 7, text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ" },
    ],
  },
  {
    id: "an-nas",
    title: "الناس",
    reference: "١١٤",
    sourceUrl: "https://quran.com/ar/an-nas",
    basmala: true,
    verses: [
      { number: 1, text: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ" },
      { number: 2, text: "مَلِكِ ٱلنَّاسِ" },
      { number: 3, text: "إِلَـٰهِ ٱلنَّاسِ" },
      { number: 4, text: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ" },
      { number: 5, text: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ" },
      { number: 6, text: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ" },
    ],
  },
  {
    id: "al-falaq",
    title: "الفلق",
    reference: "١١٣",
    sourceUrl: "https://quran.com/ar/al-falaq",
    basmala: true,
    verses: [
      { number: 1, text: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ" },
      { number: 2, text: "مِن شَرِّ مَا خَلَقَ" },
      { number: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ" },
      { number: 4, text: "وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ" },
      { number: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ" },
    ],
  },
  {
    id: "al-ikhlas",
    title: "الإخلاص",
    reference: "١١٢",
    sourceUrl: "https://quran.com/ar/al-ikhlas",
    basmala: true,
    verses: [
      { number: 1, text: "قُلْ هُوَ ٱللَّهُ أَحَدٌ" },
      { number: 2, text: "ٱللَّهُ ٱلصَّمَدُ" },
      { number: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ" },
      { number: 4, text: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ" },
    ],
  },
  {
    id: "al-kafirun",
    title: "الكافرون",
    reference: "١٠٩",
    sourceUrl: "https://quran.com/ar/al-kafirun",
    basmala: true,
    verses: [
      { number: 1, text: "قُلْ يَـٰٓأَيُّهَا ٱلْكَـٰفِرُونَ" },
      { number: 2, text: "لَآ أَعْبُدُ مَا تَعْبُدُونَ" },
      { number: 3, text: "وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ" },
      { number: 4, text: "وَلَآ أَنَا۠ عَابِدٌۭ مَّا عَبَدتُّمْ" },
      { number: 5, text: "وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ" },
      { number: 6, text: "لَكُمْ دِينُكُمْ وَلِىَ دِينِ" },
    ],
  },
];

export const AYAT_AL_KURSI: QuranPassage = {
  id: "ayat-al-kursi",
  title: "آية الكرسي",
  reference: "البقرة · ٢٥٥",
  sourceUrl: "https://quran.com/ar/al-baqarah/255",
  verses: [
    {
      number: 255,
      text: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
    },
  ],
};

export const DHIKR_PHRASES = [
  "سُبْحَانَ اللَّهِ",
  "وَالْحَمْدُ لِلَّهِ",
  "وَلَا إِلَٰهَ إِلَّا اللَّهُ",
  "وَاللَّهُ أَكْبَرُ",
];

export const HAWQALAH = "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ";

export const IBRAHIMIYYAH =
  "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ.";

export const FORGIVENESS_DUA =
  "اللَّهُمَّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ وَالْمُسْلِمِينَ وَالْمُسْلِمَاتِ، الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ.";

export const GENERAL_DUA =
  "اللَّهُمَّ افْعَلْ بِي وَبِهِمْ عَاجِلًا وَآجِلًا فِي الدِّينِ وَالدُّنْيَا وَالْآخِرَةِ مَا أَنْتَ لَهُ أَهْلٌ، وَلَا تَفْعَلْ بِنَا يَا مَوْلَانَا مَا نَحْنُ لَهُ أَهْلٌ، إِنَّكَ غَفُورٌ حَلِيمٌ جَوَادٌ كَرِيمٌ رَؤُوفٌ رَحِيمٌ.";
