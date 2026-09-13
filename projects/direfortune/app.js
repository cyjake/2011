/* Browser port of the original 2009 Python/Google App Engine app. */
(() => {
  "use strict";

  const YEAR_CODES = [19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,21952,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19415,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448];
  const CRITIQUES = [
  "一生衣食奔波勞碌之命",
  "幼年勞碌中年清泰之命",
  "先難後易出外求人之命",
  "智巧多能離家求食之命",
  "身閒心不閒九流藝術之命",
  "先貧後富勞碌之命",
  "聰明近貴衣祿之命",
  "自卓為人才能近貴之命",
  "客商才能達變智慧之命",
  "衣食有餘近貴成家之命",
  "先貧後富近貴衣食足用之命",
  "性巧過人衣食到老近貴之命",
  "衣食豐滿富貴根基之命",
  "財穀有餘主得內助富貴之命",
  "先難後易過房入贅近貴之命",
  "超群拔類衣祿厚重之命",
  "聰明富貴有福壽之命",
  "財帛豐厚宜稱之命",
  "利上近貴有福有祿之命",
  "富貴近益生匯鼎盛機關之命",
  "稅戶近貴專才衣祿之命",
  "兵權有職富貴才能之命",
  "財祿厚重白手成家之命",
  "才能好學近貴財祿之命",
  "福祿豐盈極富且貴之命",
  "富貴有餘福壽雙全之命",
  "高官厚祿學業飽滿之命",
  "官員財祿厚重之命",
  "性巧精乖倉庫財祿之命",
  "文武才能財穀豐富之命",
  "官職財祿榮民富貴之命",
  "掌握兵權富貴長壽之命",
  "僧道門中近貴之命",
  "有權威富貴財祿之命",
  "官職財祿豐堅之命",
  "官職長享榮華富貴之命",
  "官職文章壓眾精通之命",
  "官祿旺相才能性直富貴之命",
  "官職財祿厚重之命",
  "官職榮華福壽財祿之命",
  "官掌風雷權柄之命",
  "官職有權柄之命命",
  "指揮太守萬戶封侯之命",
  "官職尚書侍郎之命",
  "威權無盡財福祿全之命",
  "公侯駙馬丞相之命",
  "冠世萬國來朝上格之命",
  "溫和幸福富貴極吉之命",
  "受職高位功名顯達之命",
  "權力共備志望上流之命",
  "大志大業勢如破竹之命",
  "號令天下統御萬民帝王之命"
];
  const POEMS = [
  "短命非業謂大凶，平生災難事重重；凶禍頻臨陷逆境，終世困苦事不成。",
  "身寒骨冷苦伶仃，此命推來行乞人；勞勞碌碌難度日，終年打拱過平生。",
  "此命推來骨格輕，求謀作事事難成；妻兒子女應難許，別處他鄉作散人。",
  "此命推來福祿無，門庭困苦總難榮；六親骨肉皆無靠，流浪他鄉作老翁。",
  "命推來福祖業微，庭困營度似稀奇；六親骨肉如冰炭，一世勤勞自把持。",
  "平生衣祿苦中求，獨自營謀事不休；離祖出門宜早計，晚來衣食自無憂。",
  "一生作事少商量，難靠祖宗作主張；獨馬單槍空做去，早年晚歲總無長。",
  "一生行事似飄蓬，祖宗產業在夢中；若不過房改名姓，也當移徙二三通。",
  "初年運限未能通，縱有功名在後成；須過四旬才可立，移居改姓始為良。",
  "勞勞碌碌苦中求，東奔西走何日休；若能終身勤與儉，老來稍可免憂愁。",
  "忙忙碌碌苦中求，何日雲開見日頭；難得祖基家可立，中年衣食漸無憂。",
  "初年運蹇事難謀，漸有財源如水流；到得中年衣食旺，那時名利一齊收。",
  "早年做事事難成，百計勤勞枉費心；半世自如流水去，後來運到始得金。",
  "此命福氣果如何，僧道門中衣祿多；離祖出家方為妙，朝晚拜佛念彌陀。",
  "生平福量不周全，祖業根基覺少傳；營事生涯宜守舊，時來衣食勝從前。",
  "不須勞碌過平生，獨自成家福不輕；早有福星常照命，任君行去百般成。",
  "此命般般事不成，弟兄少力自孤行；縱然祖業雖微有，來得明時去不明。",
  "一生骨肉最清高，早入黌門姓名標；待到年將三十六，藍衣脫去換紅袍。",
  "此命終身運不通，勞勞作事盡皆空；苦心竭力成家計，到得那時在夢中。",
  "平生衣祿是綿長，件件心中自主張；前面風霜多受過，後來必定享安康。",
  "此命推來是不同，為人能幹異凡庸；中年還有逍遙福，不比前年運未通。",
  "得寬懷處且寬懷，何用雙眉皺不開；若使中年命運濟，那時名利一齊來。",
  "為人心性最聰明，作事軒昂近貴人；衣祿一生天數定，不須勞碌是豐享。",
  "萬事由天莫苦求，須知福祿賴人修；中年財帛難如意，晚景欣然便不憂。",
  "名利推來竟若何，前番辛苦後奔波；命中難養男與女，骨肉扶持也不多。",
  "東南西北盡皆通，出姓移居更覺隆；衣祿無虧天數定，中年晚景一般同。",
  "此命推來旺末年，妻榮子貴自怡然；平生原有滔滔福，可有財源若水泉。",
  "幼年運道未能通，若是蹉跎命不同；兄弟六親皆無靠，一身事業晚來隆。",
  "此命推來福不輕，自成自立顯門庭；從來富貴人親近，使婢差奴過一生。",
  "為利為名終日勞，中年福祿也多遭；老年自有財星照，不比前番目下高。",
  "一世榮華事事通，不須勞苦自亨通；弟兄取侄皆如意，家業成時福祿宏。",
  "一世亨通事事能，不須勞苦自然寧；宗族欣然福祿多，家業豐亨自稱心。",
  "此格推來福祿宏，興家發達在其中；一生衣食安排定，卻是人間一富翁。",
  "此命推來厚且清，詩書滿腹功業成；豐衣足食自然穩，正是人間有福人。",
  "走馬揚鞭爭利名，少年做事費評論；一朝福祿源源至，富貴榮華顯六親。",
  "此格推來禮義通，一生福祿用無窮；甜酸苦辣皆嚐過，財源滾滾穩且通。",
  "福祿豐盈萬事全，一生榮耀顯雙親；名揚威振人欽敬，處世逍遙似神仙。",
  "平生福祿自然來，名利兼全福壽偕；雁塔題名為貴客，紫袍玉帶走金階。",
  "細推此格秀且清，必定財高學業成；甲第之中應有分，揚鞭走馬顯威榮。",
  "一朝金榜快題名，顯祖榮官大器成；衣食自然豐裕足，田園財帛更豐盈。",
  "不作朝中金榜客，官為世上一財翁；聰明天賦經書熟，名顯高科自是榮。",
  "此命生來福不窮，讀書必定顯親族；紫衣金帶為卿相，富貴榮華皆可同。",
  "命主為官福祿長，得來富貴定非常；名題雁塔傳金榜，顯耀門庭天下揚。",
  "此命威權不可當，紫袍金帶坐高堂；榮華富貴誰能及，百世留名姓氏揚。",
  "細推此命福不輕，富貴榮華孰與爭；定國安邦榮品人，威聲顯赫四方聞。",
  "此格人間一福人，堆金積玉滿堂春；從來富貴由天定，金榜題名謁聖君。",
  "此命生來福自宏，田園家業最高隆；平生衣食豐盈足，一世榮華萬事通。",
  "福貴由天莫苦求，萬金家計不須謀；十年不比前番事，祖業根基水上舟。",
  "君是人間衣祿星，一生富貴眾人欽；縱然福祿由天定，安享榮華過一生。",
  "此命推來福非輕，不須愁慮苦勞心；一生天定衣興祿，富貴榮華主一生。",
  "此命生成大不同，公侯卿相在其中；一生自有逍遙福，富貴榮華極品隆。",
  "此格世界罕有生，十代積善產此人；天上紫微來照命，統治萬民樂太平。"
];
  const YEAR_WEIGHTS = [12,9,6,7,12,5,9,8,7,8,15,9,16,8,8,19,12,6,8,7,5,15,6,16,15,8,9,12,10,7,15,6,5,14,14,9,7,7,9,12,8,7,13,5,14,5,9,17,5,7,12,8,8,6,19,6,8,16,10,7];
  const MONTH_WEIGHTS = [6,7,18,9,5,16,9,15,18,8,9,5];
  const DAY_WEIGHTS = [5,10,8,15,16,15,8,16,8,16,9,17,8,17,10,8,9,18,5,15,10,9,8,9,15,18,5,8,16,6];
  const TIME_WEIGHTS = [16,6,7,10,9,16,10,8,8,9,6,6];
  const TIME_NAMES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
  const GAN = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
  const ZHI = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
  const NUMBER = ["零","一","二","三","四","五","六","七","八","九","十"];
  const START_DAY = Date.UTC(1900, 0, 31) / 86400000;
  const END_DAY = Date.UTC(2050, 0, 22) / 86400000;

  function parseYear(code) {
    const leapMonth = code & 0xf;
    let bits = code >> 4;
    const months = new Array(12);
    let days = 0;
    for (let index = 0; index < 12; index += 1) {
      const monthDays = bits & 1 ? 30 : 29;
      months[11 - index] = monthDays;
      days += monthDays;
      bits >>= 1;
    }
    if (leapMonth > 0) {
      const leapDays = bits & 1 ? 30 : 29;
      months.splice(leapMonth, 0, leapDays);
      days += leapDays;
    }
    return { days, months, leapMonth };
  }

  const LUNAR_YEARS = YEAR_CODES.map(parseYear);

  function parseDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const utc = Date.UTC(year, month - 1, day);
    const date = new Date(utc);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return utc / 86400000;
  }

  function gregorianToLunar(value) {
    const dayNumber = typeof value === "number" ? value : parseDate(value);
    if (dayNumber === null || dayNumber < START_DAY || dayNumber > END_DAY) throw new RangeError("日期超出可计算范围");
    let remaining = dayNumber - START_DAY;
    let yearIndex = 0;
    while (yearIndex < LUNAR_YEARS.length && remaining >= LUNAR_YEARS[yearIndex].days) {
      remaining -= LUNAR_YEARS[yearIndex].days;
      yearIndex += 1;
    }
    const yearData = LUNAR_YEARS[yearIndex];
    let monthIndex = 0;
    while (monthIndex < yearData.months.length && remaining >= yearData.months[monthIndex]) {
      remaining -= yearData.months[monthIndex];
      monthIndex += 1;
    }
    let month = monthIndex + 1;
    let intercalary = false;
    if (yearData.leapMonth > 0 && yearData.leapMonth < month) {
      month -= 1;
      intercalary = month === yearData.leapMonth;
    }
    return { year: 1900 + yearIndex, month, day: remaining + 1, intercalary };
  }

  function zhNumber(number) {
    if (number <= 10) return NUMBER[number];
    if (number < 20) return "十" + NUMBER[number % 10];
    if (number === 20 || number === 30) return NUMBER[number / 10] + "十";
    return "廿" + NUMBER[number % 10];
  }

  function formatLunar(date) {
    const year = GAN[(date.year - 4) % 10] + ZHI[(date.year - 4) % 12] + "年";
    const month = (date.intercalary ? "闰" : "") + (date.month === 1 ? "正" : zhNumber(date.month)) + "月";
    const day = (date.day <= 10 ? "初" : "") + zhNumber(date.day) + "日";
    return year + month + day;
  }

  function yearWeight(year) {
    const heavenlyStem = (year - 4) % 10;
    const earthlyBranch = (year - 4) % 12;
    const rawIndex = earthlyBranch < 10
      ? (heavenlyStem - earthlyBranch) * 6 + earthlyBranch
      : (heavenlyStem - earthlyBranch + 10) * 6 + earthlyBranch;
    const index = (rawIndex + 60) % 60;
    return YEAR_WEIGHTS[index];
  }

  function fortuneFor(lunar, timeIndex) {
    const weight = yearWeight(lunar.year) + MONTH_WEIGHTS[lunar.month - 1] + DAY_WEIGHTS[lunar.day - 1] + TIME_WEIGHTS[timeIndex];
    const resultIndex = weight - 21;
    if (resultIndex < 0 || resultIndex >= CRITIQUES.length) throw new RangeError("未找到对应批注");
    return {
      weight,
      weightText: zhNumber(Math.floor(weight / 10)) + "两" + zhNumber(weight % 10) + "钱",
      critique: CRITIQUES[resultIndex],
      poem: POEMS[resultIndex]
    };
  }

  globalThis.Direfortune = { gregorianToLunar, formatLunar, fortuneFor };
  if (typeof document === "undefined") return;

  const form = document.querySelector("#fortune-form");
  const result = document.querySelector("#fortune-result");
  const empty = document.querySelector("#fortune-empty");
  const error = document.querySelector("#form-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    try {
      const lunar = gregorianToLunar(document.querySelector("#birth-date").value);
      const timeIndex = Number(document.querySelector("#birth-time").value);
      if (!Number.isInteger(timeIndex) || timeIndex < 0 || timeIndex > 11) throw new RangeError("请选择出生时辰");
      const fortune = fortuneFor(lunar, timeIndex);
      document.querySelector("#lunar-date").textContent = "农历 " + formatLunar(lunar) + " · " + TIME_NAMES[timeIndex] + "时";
      document.querySelector("#fortune-weight").textContent = fortune.weightText;
      document.querySelector("#fortune-critique").textContent = fortune.critique;
      document.querySelector("#fortune-poem").textContent = fortune.poem;
      empty.hidden = true;
      result.hidden = false;
      result.setAttribute("aria-hidden", "false");
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (problem) {
      result.hidden = true;
      result.setAttribute("aria-hidden", "true");
      empty.hidden = false;
      error.textContent = problem.message || "请检查输入";
    }
  });

  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));

  let installPrompt;
  const installButton = document.querySelector("#install-app");
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });
  installButton.addEventListener("click", async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    installPrompt = null;
    installButton.hidden = true;
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    installButton.hidden = true;
  });
})();
