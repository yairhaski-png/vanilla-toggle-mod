'use strict';
// Collection copy. Prices are suggested retail in ILS (incl. VAT) — placeholders until factory cost is known.
const SHIRTS = [
  // ---- Logo collection (1 shirt per logo) ----
  { id: 'vexo-original', name: 'Vexo Original', logo: 'classic', color: 'black', front: ['center', 'HELLO, EARTHLING'], back: ['nape', ''], price: 99, tag: 'חולצת דגל',
    who: 'כולם · בעיקר 16–35', why: ['הלוגו הראשי של המותג בגודל מלא – מה שהלקוח זוכר.', 'שחור + סגול = ניגודיות חזקה בתמונות באתר ובאינסטגרם.', 'חולצת הכניסה לחנות: מחיר נגיש, הכי קל להחליט עליה.'] },
  { id: 'ghost-line', name: 'Ghost Line', logo: 'outline', color: 'white', front: ['center', 'LINE ART'], back: ['nape', ''], price: 99, tag: 'מינימליסטי',
    who: 'מינימליסטים · 20–35 · בנות ובנים', why: ['גרסת קו נקייה – מרגישה "מותג פרימיום" בלי להשקיע בהדפס מורכב.', 'לבן שבור נותן קונטרסט לשחור/כהה שהחנות תהיה מלאה בו.', 'הדפס בצבע אחד – זול לייצור ולכן שולי רווח טובים.'] },
  { id: 'vexo-badge', name: 'Vexo Badge', logo: 'badge', color: 'lavender', front: ['chest', ''], back: ['big', 'SEND SNACKS'], price: 109, tag: 'לוגו חזה',
    who: 'סטודנטים · 18–28', why: ['לוגו קטן על החזה + הדפס גדול מאחור – הסטייל של סטריט־וור.', 'הלבנדר מבדיל את החנות מהים של שחור/לבן אצל מתחרים.', 'העיגול נראה טוב גם כתמונת פרופיל ומדבקה (ראו מוצרים נלווים).'] },
  { id: 'arcade-ghost', name: 'Arcade Ghost', logo: 'arcade', color: 'black', front: ['center', 'PLAYER ONE'], back: ['text', 'GAME\nON'], price: 109, tag: 'גיימרים',
    who: 'גיימרים · 14–30 · בעיקר בנים', why: ['סטייל ארקייד רטרו – קהל שמזהה ומתחבר מיד.', 'הדפס קדימה ואחורה מצדיק מחיר מעט גבוה.', 'קל לשווק בקהילות גיימינג, דיסקורד וטיקטוק.'] },
  { id: 'grumpy-vexo', name: 'Grumpy Vexo', logo: 'grumpy', color: 'white', front: ['center', 'NOT TODAY'], back: ['text', 'STILL\nNO'], price: 99, tag: 'הומור',
    who: 'הומור סרקסטי · 18–35', why: ['הבעה כועסת + משפט קצר = חולצה שמצלמים ומשתפים.', 'טקסט על הגב יוצר "בדיחה שנייה" כשהולכים ממך.', 'מחיר נמוך כדי לעודד קנייה אימפולסיבית.'] },
  { id: 'seal-of-vexo', name: 'Seal of Vexo', logo: 'seal', color: 'black', front: ['chest', ''], back: ['big', 'OFFICIALLY WEIRD'], price: 109, tag: 'קלאסי',
    who: 'אוהבי סטריט קלאסי · 20–40', why: ['חותם עגול מרגיש כמו מותג "ותיק" ואמין.', 'עובד מצוין למתנות – מראה נקי ובוגר.', 'מתאים גם כבסיס להודי/קפוצ׳ון בעתיד.'] },
  { id: 'bean-buddy', name: 'Bean Buddy', logo: 'bean', color: 'lavender', front: ['center', 'STAY SOFT'], back: ['nape', ''], price: 99, tag: 'חמוד',
    who: 'נוער ונשים צעירות · 14–28', why: ['צורה עגולה וחמודה – הכי "ידידותי" בקולקציה.', 'משפט חיובי שנוח לקנות למתנה.', 'לבנדר + סגול נראה טוב בצילומי לייף־סטייל.'] },
  { id: 'vexo-zoom', name: 'Vexo Zoom', logo: 'speed', color: 'black', front: ['center', 'GOTTA GO FAST'], back: ['nape', ''], price: 109, tag: 'אנרגיה',
    who: 'ספורטיביים ואנרגטיים · 16–30', why: ['קווי מהירות נותנים תחושת תנועה – מושך את העין בפיד.', 'משפט מוכר מהתרבות הפופולרית = קל להבין.', 'מתאים למכירות "דרופ" קצרות ומוגבלות.'] },
  { id: 'love-alien', name: 'Love Alien', logo: 'heart', color: 'white', front: ['center', 'MADE WITH LOVE'], back: ['text', 'FROM ANOTHER\nPLANET'], price: 109, tag: 'מתנה',
    who: 'זוגות ומתנות · נשים 18–35', why: ['לב + חייזר: מתנה אידיאלית לוולנטיינ׳ס, יום הולדת ואירועים.', 'עובד על נשים וגברים – קהל רחב.', 'אפשר למכור כזוג (2 חולצות) במחיר מבצע.'] },
  { id: 'wink-wink', name: 'Wink Wink', logo: 'wink', color: 'purple', front: ['center', 'WINK'], back: ['nape', ''], price: 99, tag: 'צבע מותג',
    who: 'צעירים חברתיים · 16–30', why: ['חולצה בסגול המותג – הכי "Vexo" שיש, מזהה אותנו ברחוב.', 'קו אחד בשמנת על סגול: הדפס פשוט וחד.', 'קריצה = פלרטטני וקליל, מתאים לקהל צעיר.'] },
  { id: 'vexo-app', name: 'Vexo App', logo: 'app', color: 'black', front: ['chest', ''], back: ['big', 'OPEN ME'], price: 109, tag: 'טכנולוגי',
    who: 'טכנולוגיים וסטארטאפיסטים · 22–40', why: ['אייקון אפליקציה – בדיחה פנימית שקהל הייטק אוהב.', 'נראה כמו מרצ׳ של חברה – מתאים גם להזמנות קבוצתיות.', 'לוגו קטן = הדפס זול, רווח גבוה.'] },
  { id: 'big-iris', name: 'Big Iris', logo: 'iris', color: 'white', front: ['giant', ''], back: ['nape', ''], price: 119, tag: 'הדפס גדול',
    who: 'אוהבי הדפסים גדולים · 18–35', why: ['הדפס ענק – חולצה "וואו" שנראית מרחוק.', 'עיניים גדולות מושכות אינטראקציה ותשומת לב.', 'מחיר גבוה יותר בגלל שטח הדפס מלא.'] },
  { id: 'chomp', name: 'Chomp', logo: 'chomp', color: 'black', front: ['center', 'CHOMP'], back: ['text', 'FEED\nME'], price: 109, tag: 'רטרו',
    who: 'גיימרים רטרו · 16–35', why: ['מחווה למשחקי הארקייד הקלאסיים – נוסטלגיה מוכרת.', 'משפט על הגב מוסיף הומור.', 'משתלב עם Arcade Ghost ו־Pixel כסדרת גיימינג (מבצע 3 ב־299).'] },
  { id: 'thin-ring', name: 'Thin Ring', logo: 'ring', color: 'white', front: ['chest', ''], back: ['nape', ''], price: 99, tag: 'נקי',
    who: 'מינימליסטים · 20–40', why: ['קו דק ולוגו קטן – החולצה הכי "שקטה" בקולקציה.', 'מתאימה ללובשים יומיומיים ולמשרד קז׳ואל.', 'קל לשלב עם כל דבר – מחזירה קונים.'] },
  { id: 'pixel-vexo', name: 'Pixel Vexo', logo: 'pixel', color: 'black', front: ['center', '8-BIT'], back: ['text', 'LEVEL\nUP'], price: 109, tag: 'גיימרים',
    who: 'גיימרים וגיקים · 14–35', why: ['פיקסל־ארט – סגנון שנמכר היטב ולא יוצא מהאופנה.', 'הדפס פשוט (כמה מלבנים) – נקי ומדויק גם בהדפסה זולה.', 'משלים את סדרת הגיימינג.'] },
  { id: 'peek', name: 'Peek', logo: 'peek', color: 'lavender', front: ['giant', ''], back: ['nape', ''], price: 109, tag: 'עיצוב חד',
    who: 'אוהבי עיצוב · 18–32', why: ['קו אלכסוני חותך את הדמות – נראה מודרני ובלתי צפוי.', 'לבנדר + סגול – פלטה רכה ונקייה.', 'מתאים לצילומי סטודיו על רקע ניטרלי.'] },
  { id: 'vexo-shield', name: 'Vexo Shield', logo: 'shield', color: 'charcoal', front: ['chest', ''], back: ['big', 'PROTECT THE WEIRD'], price: 109, tag: 'מסר',
    who: 'נערים וגברים · 16–35', why: ['מגן = תחושת חוזק ושייכות ("הקהילה שלנו").', 'משפט חזק מאחור שנוח לשתף.', 'אפור פחם – צבע נוסף לגיוון מעבר לשחור.'] },
  { id: 'watcher', name: 'Watcher', logo: 'watcher', color: 'black', front: ['center', 'I SEE YOU'], back: ['text', 'YES,\nYOU'], price: 99, tag: 'הומור אפל',
    who: 'הומור אפל קליל · 18–35', why: ['רק עיניים ואנטנה – מינימלי אבל מיד מזוהה.', 'טקסט קדימה ואחורה יוצר רגע קומי.', 'מחיר נמוך לרכישת ניסיון.'] },
  { id: 'one-eye', name: 'One Eye', logo: 'cyclops', color: 'purple', front: ['center', 'ONE OF A KIND'], back: ['nape', ''], price: 109, tag: 'ייחודי',
    who: 'אינדיבידואליסטים · 16–35', why: ['עין אחת ענקית – דמות שנראית שונה מכל השאר.', 'המסר "ייחודי" מתאים למי שאוהב להיות שונה.', 'סגול על סגול־מותג: גרסה עם נוכחות חזקה בפיד.'] },
  { id: 'vexo-orbit', name: 'Vexo Orbit', logo: 'planet', color: 'charcoal', front: ['center', 'LOST IN SPACE'], back: ['big', 'SEND HELP'], price: 119, tag: 'פרימיום',
    who: 'חובבי חלל ופנטזיה · 16–40', why: ['כוכב + טבעת = הגרסה "הכי חייזרית" של הלוגו.', 'עיצוב מורכב יותר – מצדיק מחיר פרימיום.', 'נראה מעולה בצילום קרוב.'] },

  // ---- Mood series (from the expression sheet) ----
  { id: 'mood-hey', name: 'Mood · Hey', logo: 'm_hey', color: 'white', front: ['center', 'HEY.'], back: ['nape', ''], price: 99, tag: 'סדרת Moods',
    who: 'כולם · 14–35', why: ['הבעה ידידותית – החולצה הכי "קלה לעכל" בסדרה.', 'קו מתאר שחור מזכיר מדבקה/קומיקס.', 'חלק מסדרת ה־6 – מעודד אספנות (מבצע 3 ב־269).'] },
  { id: 'mood-wink', name: 'Mood · Wink', logo: 'm_wink', color: 'lavender', front: ['center', 'OKAY, WINK'], back: ['nape', ''], price: 99, tag: 'סדרת Moods',
    who: 'צעירים · 14–30', why: ['הקריצה נותנת אופי שובב.', 'נראית מעולה בתמונות עם חברים.', 'מחיר סדרה אחיד – קל להסביר ללקוח.'] },
  { id: 'mood-grr', name: 'Mood · Grr', logo: 'm_grr', color: 'white', front: ['center', 'GRRR'], back: ['nape', ''], price: 99, tag: 'סדרת Moods',
    who: 'בנים · 14–28', why: ['כעס חמוד – רגש שכולם מכירים.', 'טקסט של מילה אחת = קריא מרחוק.', 'מתאים גם להדפסה על קפוצ׳ון בהמשך.'] },
  { id: 'mood-whoa', name: 'Mood · Whoa', logo: 'm_whoa', color: 'black', front: ['center', 'WHOA'], back: ['nape', ''], price: 99, tag: 'סדרת Moods',
    who: 'כולם · 14–30', why: ['הפתעה – הבעה שמושכת עיניים.', 'קווי הניצוץ נראים מעולה על שחור.', 'אחת מהחולצות הכי "מצחיקות" לצילום.'] },
  { id: 'mood-crush', name: 'Mood · Crush', logo: 'm_crush', color: 'white', front: ['center', 'CRUSH ALERT'], back: ['nape', ''], price: 99, tag: 'סדרת Moods',
    who: 'נשים צעירות וזוגות · 14–30', why: ['עיני לב – מושלם לוולנטיינ׳ס ופרחי יום־הולדת.', 'ורוד־מגנטה קטן מוסיף צבע נקי.', 'נמכר טוב כמתנה.'] },
  { id: 'mood-zzz', name: 'Mood · Zzz', logo: 'm_zzz', color: 'black', front: ['center', 'DO NOT WAKE'], back: ['nape', ''], price: 99, tag: 'סדרת Moods',
    who: 'ישנוניים · 14–40', why: ['הכי מזוהה עם "יום שני בבוקר" – מתחבר לכולם.', 'מתאים גם כחולצת שינה/לאונג׳.', 'הומור שכולם מבינים.'] },
  { id: 'angel-vexo', name: 'Angel Vexo', logo: 'angel', color: 'white', front: ['center', 'GOOD VIBES ONLY'], back: ['big', 'BLESSED'], price: 119, tag: 'מתנה · פרימיום',
    who: 'נשים 16–35 · מתנות', why: ['הילה זהובה + שתי אנטנות – גרסה "מלאכית" של הדמות (מבוסס על עיצוב הרקמה).', 'המסר החיובי מתאים למתנה.', 'המחיר מעט גבוה כי יש בו צבע נוסף (זהב).'] },
];

// Favourites (logos we love) + extra products
const FAVORITES = [
  { logo: 'classic', name: 'Classic', pitch: 'הלוגו הראשי – חייב להופיע על כל מוצר. עובד על כל צבע ורקע, ואפשר לזהות אותו גם בקטן.' },
  { logo: 'badge', name: 'Badge', pitch: 'עיגול מושלם למדבקות, תיקים ומעטפות – צורה שמתאימה בדיוק לפורמט "תווית".' },
  { logo: 'angel', name: 'Angel', pitch: 'מבוסס על עיצוב הרקמה שהעלית – הילה זהובה. קורא "פרימיום" ונראה מעולה כרקמה על כובע.' },
  { logo: 'pixel', name: 'Pixel', pitch: 'פיקסל־ארט – מדבקות ומחזיקי מפתחות של גיימרים מתים על זה, ואין לו בעיית איכות בהדפסה.' },
  { logo: 'heart', name: 'Love Alien', pitch: 'הכי מתנתי בקולקציה. ספל, כיסוי לטלפון או תיק – מוצרים שקונים לאחרים.' },
];

const PRODUCTS = [
  { key: 'cap', name: 'כובע Dad Hat עם רקמה', price: 89, note: 'רקמה 3" על החזית. סכום רקמה מוסיף ערך נתפס.' },
  { key: 'mug', name: 'ספל קרמי 330 מ״ל', price: 49, note: 'ספל לבן עם הדפס אחד – מתנה זולה שמעלה סל קנייה.' },
  { key: 'tote', name: 'תיק בד (Tote)', price: 69, note: 'קנבס טבעי, הדפס חזית. מוצר פרסום הליכה.' },
  { key: 'sticker', name: 'מדבקה Die-Cut', price: 15, note: 'מדבקה בחיתוך לפי קו עם מסגרת לבנה. מתאימה לחבילות (3 ב־35₪).' },
  { key: 'phone', name: 'כיסוי לטלפון', price: 69, note: 'כיסוי קשיח עם הדפס מרכזי. בחרו דגמים נפוצים.' },
];

module.exports = { SHIRTS, FAVORITES, PRODUCTS };
