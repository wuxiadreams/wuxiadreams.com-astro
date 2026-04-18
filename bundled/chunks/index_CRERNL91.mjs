globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead, b as addAttribute } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$Layout, A as AuthDialog } from "./layout_D8_XCjtG.mjs";
import { $ as $$Image } from "./_astro_assets_D3btVnR0.mjs";
import { env } from "cloudflare:workers";
import { d as drizzle, a as schema, h as asc, x as chapter, e as eq, c as desc, n as novel, b as and, z as gt, v as tag, i as category } from "./schema_98e5FuKX.mjs";
import { f as fetchRankingData } from "./rankings_UP0RH0m9.mjs";
import { R as RANK_TYPE } from "./constants_BOIxQnwR.mjs";
const minutesInMonth = 43200;
const minutesInDay = 1440;
const constructFromSymbol = /* @__PURE__ */ Symbol.for("constructDateFrom");
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);
  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);
  if (date instanceof Date) return new date.constructor(value);
  return new Date(value);
}
function toDate(argument, context) {
  return constructFrom(argument, argument);
}
let defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}
function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    context || dates.find((date) => typeof date === "object")
  );
  return dates.map(normalize);
}
function compareAsc(dateLeft, dateRight) {
  const diff = +toDate(dateLeft) - +toDate(dateRight);
  if (diff < 0) return -1;
  else if (diff > 0) return 1;
  return diff;
}
function constructNow(date) {
  return constructFrom(date, Date.now());
}
function differenceInCalendarMonths(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
  const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();
  return yearsDiff * 12 + monthsDiff;
}
function getRoundingMethod(method) {
  return (number) => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    return result === 0 ? 0 : result;
  };
}
function differenceInMilliseconds(laterDate, earlierDate) {
  return +toDate(laterDate) - +toDate(earlierDate);
}
function endOfDay(date, options) {
  const _date = toDate(date);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function endOfMonth(date, options) {
  const _date = toDate(date);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function isLastDayOfMonth(date, options) {
  const _date = toDate(date);
  return +endOfDay(_date) === +endOfMonth(_date);
}
function differenceInMonths(laterDate, earlierDate, options) {
  const [laterDate_, workingLaterDate, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    laterDate,
    earlierDate
  );
  const sign = compareAsc(workingLaterDate, earlierDate_);
  const difference = Math.abs(
    differenceInCalendarMonths(workingLaterDate, earlierDate_)
  );
  if (difference < 1) return 0;
  if (workingLaterDate.getMonth() === 1 && workingLaterDate.getDate() > 27)
    workingLaterDate.setDate(30);
  workingLaterDate.setMonth(workingLaterDate.getMonth() - sign * difference);
  let isLastMonthNotFull = compareAsc(workingLaterDate, earlierDate_) === -sign;
  if (isLastDayOfMonth(laterDate_) && difference === 1 && compareAsc(laterDate_, earlierDate_) === 1) {
    isLastMonthNotFull = false;
  }
  const result = sign * (difference - +isLastMonthNotFull);
  return result === 0 ? 0 : result;
}
function differenceInSeconds(laterDate, earlierDate, options) {
  const diff = differenceInMilliseconds(laterDate, earlierDate) / 1e3;
  return getRoundingMethod(options?.roundingMethod)(diff);
}
const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
const formatDistance$1 = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}
const dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
const dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
const formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
const formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
const formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}
const eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
const monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};
const dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
};
const dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
const formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
const ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
const localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // [TODO] -- I challenge you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
const parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
const matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
const parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
const matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
const parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
const matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
const parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
const match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
const enUS = {
  code: "en-US",
  formatDistance: formatDistance$1,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function formatDistance(laterDate, earlierDate, options) {
  const defaultOptions2 = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions2.locale ?? enUS;
  const minutesInAlmostTwoDays = 2520;
  const comparison = compareAsc(laterDate, earlierDate);
  if (isNaN(comparison)) throw new RangeError("Invalid time value");
  const localizeOptions = Object.assign({}, options, {
    addSuffix: options?.addSuffix,
    comparison
  });
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    ...comparison > 0 ? [earlierDate, laterDate] : [laterDate, earlierDate]
  );
  const seconds = differenceInSeconds(earlierDate_, laterDate_);
  const offsetInSeconds = (getTimezoneOffsetInMilliseconds(earlierDate_) - getTimezoneOffsetInMilliseconds(laterDate_)) / 1e3;
  const minutes = Math.round((seconds - offsetInSeconds) / 60);
  let months;
  if (minutes < 2) {
    if (options?.includeSeconds) {
      if (seconds < 5) {
        return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
      } else if (seconds < 10) {
        return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
      } else if (seconds < 20) {
        return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
      } else if (seconds < 40) {
        return locale.formatDistance("halfAMinute", 0, localizeOptions);
      } else if (seconds < 60) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", minutes, localizeOptions);
      }
    }
  } else if (minutes < 45) {
    return locale.formatDistance("xMinutes", minutes, localizeOptions);
  } else if (minutes < 90) {
    return locale.formatDistance("aboutXHours", 1, localizeOptions);
  } else if (minutes < minutesInDay) {
    const hours = Math.round(minutes / 60);
    return locale.formatDistance("aboutXHours", hours, localizeOptions);
  } else if (minutes < minutesInAlmostTwoDays) {
    return locale.formatDistance("xDays", 1, localizeOptions);
  } else if (minutes < minutesInMonth) {
    const days = Math.round(minutes / minutesInDay);
    return locale.formatDistance("xDays", days, localizeOptions);
  } else if (minutes < minutesInMonth * 2) {
    months = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("aboutXMonths", months, localizeOptions);
  }
  months = differenceInMonths(earlierDate_, laterDate_);
  if (months < 12) {
    const nearestMonth = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("xMonths", nearestMonth, localizeOptions);
  } else {
    const monthsSinceStartOfYear = months % 12;
    const years = Math.trunc(months / 12);
    if (monthsSinceStartOfYear < 3) {
      return locale.formatDistance("aboutXYears", years, localizeOptions);
    } else if (monthsSinceStartOfYear < 9) {
      return locale.formatDistance("overXYears", years, localizeOptions);
    } else {
      return locale.formatDistance("almostXYears", years + 1, localizeOptions);
    }
  }
}
function formatDistanceToNow(date, options) {
  return formatDistance(date, constructNow(date), options);
}
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const db = drizzle(env.DB, { schema });
  const weeklyPicks = await fetchRankingData(db, RANK_TYPE.WEEKLY, 3);
  const latestUpdatedNovels = await db.query.novel.findMany({
    where: and(
      eq(novel.published, true),
      gt(novel.chapterCount, 0)
    ),
    orderBy: [desc(novel.updatedAt)],
    limit: 5,
    with: {
      novelAuthors: {
        with: {
          author: true
        }
      },
      chapters: {
        where: eq(chapter.published, true),
        orderBy: [asc(chapter.number)],
        limit: 1
      }
    }
  });
  const latestUpdates = latestUpdatedNovels.map((novel2) => {
    const authorName = novel2.novelAuthors?.[0]?.author?.name || "Unknown Author";
    const firstChapter = novel2.chapters?.[0];
    return {
      title: novel2.title,
      slug: novel2.slug,
      author: authorName,
      chapter: firstChapter ? `Ch. ${firstChapter.number} · ${firstChapter.title}` : "No chapters yet",
      time: formatDistanceToNow(new Date(novel2.updatedAt), { addSuffix: true })
    };
  });
  const editorsPicks = await db.query.novel.findMany({
    where: and(eq(novel.published, true), eq(novel.isPinned, true)),
    orderBy: [desc(novel.createdAt)],
    limit: 10,
    with: {
      novelAuthors: {
        with: { author: true }
      },
      novelTags: {
        with: { tag: true }
      }
    }
  });
  const featured = editorsPicks.map((novel2) => {
    const authorName = novel2.novelAuthors?.[0]?.author?.name || "Unknown Author";
    const tagName = novel2.novelTags?.[0]?.tag?.name || "Uncategorized";
    return {
      title: novel2.title,
      slug: novel2.slug,
      author: authorName,
      tag: tagName,
      cover: `https://${env.R2_DOMAIN}/${novel2.cover}`
    };
  });
  const popularTags = await db.select({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    count: tag.novelCount
  }).from(tag).orderBy(desc(tag.novelCount)).limit(10);
  const trendingCategories = await db.query.category.findMany({
    where: eq(category.isPinned, true),
    limit: 4
  });
  const user = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Wuxia Dreams — Discover and Track Novels" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="relative"> <section class="relative overflow-hidden border-b border-border/60"> <div class="pointer-events-none absolute inset-0 -z-10"> <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,hsl(var(--ring)/0.35),transparent_55%),radial-gradient(circle_at_90%_30%,hsl(var(--primary)/0.28),transparent_55%),linear-gradient(160deg,#0b1220_0%,#101b32_50%,#0f172a_100%)]"></div> <div class="absolute inset-0 opacity-40 mask-[radial-gradient(circle_at_center,black,transparent_70%)]"> <div class="h-full w-full bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-size-[44px_44px]"></div> </div> </div> <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.35fr_0.65fr] md:items-center md:py-20"> <div> <p class="text-xs font-semibold tracking-[0.28em] text-primary/90">
WUXIA DREAMS
</p> <h1 class="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
Find your next
<span class="block text-primary">can’t-put-down</span>
novel
</h1> <p class="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
Curated picks, update tracking, rankings, and a personal library.
            Turn “start a new series” impulses into a reliable reading list.
</p> <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"> <form action="/novels" method="get" class="w-full sm:max-w-md"> <label class="relative block"> <input name="q" placeholder="Search by title / author / tag…" class="h-12 w-full rounded-2xl border border-input bg-background/60 px-4 pr-28 text-sm shadow-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"> <button type="submit" class="absolute right-2 top-1/2 h-9 -translate-y-1/2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
Search
</button> </label> </form> <a href="/novels" class="inline-flex h-12 items-center justify-center rounded-2xl border border-border/70 bg-background/60 px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted">
Browse novels
</a> </div> <div class="mt-7 flex flex-wrap gap-2 text-xs text-muted-foreground"> ${trendingCategories.map((category2) => renderTemplate`<a${addAttribute(`/genre/${category2.slug}`, "href")} class="rounded-full border border-border/70 bg-background/50 px-3 py-1.5 transition hover:bg-muted hover:text-foreground">
Trending: ${category2.name} </a>`)} </div> </div> <aside class="rounded-3xl border border-border/70 bg-card/60 p-5 shadow-[0_24px_70px_hsl(222_47%_7%/0.55)] backdrop-blur"> <div class="flex items-center gap-3"> <img src="/logo.png" width="40" height="40" alt="Wuxia Dreams logo" class="h-10 w-10 rounded-xl ring-1 ring-border/70"> <div> <div class="text-sm font-semibold">This week’s picks</div> <div class="text-xs text-muted-foreground">
Blended by views, ratings, and saves
</div> </div> </div> <ol class="mt-5 grid gap-3"> ${weeklyPicks.map((item, idx) => renderTemplate`<li class="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/40 p-3 transition-colors hover:bg-background/60"> <div${addAttribute(`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${idx === 0 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-500" : idx === 1 ? "bg-slate-300/30 text-slate-500 dark:text-slate-400" : "bg-amber-700/20 text-amber-700 dark:text-amber-600"}`, "class")}> ${idx + 1} </div> <div class="min-w-0 flex-1"> <a${addAttribute(`/novel/${item.slug}`, "href")} class="block truncate text-sm font-semibold hover:text-primary transition-colors"> ${item.title} </a> <div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground"> <span class="truncate">${item.status}</span> <span>•</span> <span> ${(item.rankScore || 0).toLocaleString()} views
</span> </div> </div> </li>`)} </ol> <a href="/ranking/weekly" class="mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
View full rankings
</a> </aside> </div> </section> <section class="mx-auto max-w-6xl px-4 py-12"> <div class="flex items-end justify-between gap-4"> <div> <h2 class="text-xl font-semibold tracking-tight">Editor’s picks</h2> <p class="mt-1 text-sm text-muted-foreground">
Handpicked gems by our editors
</p> </div> <a href="/ranking/editor_pick" class="hidden text-sm font-semibold text-primary underline-offset-4 hover:underline sm:inline">
More picks
</a> </div> <div class="mt-8 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5"> ${featured.map((book) => renderTemplate`<a${addAttribute(`/novel/${book.slug}`, "href")} class="group relative flex aspect-[2/3] w-full overflow-hidden rounded-2xl bg-muted transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)] dark:hover:shadow-primary/10">  ${renderComponent($$result2, "Image", $$Image, { "src": book.cover, "alt": book.title, "width": 300, "height": 450, "loading": "lazy", "decoding": "async", "class": "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" })}  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90"></div> <div class="absolute inset-0 border border-white/10 rounded-2xl transition-colors duration-500 group-hover:border-primary/50 z-20 pointer-events-none"></div> <div class="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent_40%,rgba(255,255,255,0.1)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10 pointer-events-none"></div>  <div class="relative z-20 flex h-full w-full flex-col justify-between p-4">  <div class="flex justify-end transform transition-transform duration-500 group-hover:-translate-y-1"> <span class="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-medium tracking-wider text-white/90 backdrop-blur-md"> ${book.tag} </span> </div>  <div class="flex flex-col justify-end transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0"> <h3 class="line-clamp-2 text-base font-bold leading-tight text-white drop-shadow-md"> ${book.title} </h3> <div class="mt-2 flex items-center gap-2 opacity-80 transition-opacity duration-500 group-hover:opacity-100"> <span class="h-px w-4 bg-primary/80"></span> <p class="truncate text-xs font-medium text-white/80"> ${book.author} </p> </div> </div> </div> </a>`)} </div> </section> <section class="mx-auto max-w-6xl px-4 pb-14"> <div class="grid gap-8 md:grid-cols-[1.6fr_0.8fr]"> <div class="min-w-0"> <div class="flex items-end justify-between gap-4"> <div> <h2 class="text-xl font-semibold tracking-tight">
Latest updates
</h2> <p class="mt-1 text-sm text-muted-foreground">
Keep up effortlessly with what just dropped
</p> </div> <a href="/updates" class="hidden text-sm font-semibold text-primary underline-offset-4 hover:underline sm:inline">
View all
</a> </div> <div class="mt-6 grid gap-3"> ${latestUpdates.map((item) => renderTemplate`<a${addAttribute(`/novel/${item.slug}`, "href")} class="group flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/40 p-4 shadow-sm transition hover:bg-muted/60"> <div class="min-w-0 flex-1"> <div class="flex items-center gap-3"> <div class="flex-1 truncate text-sm font-semibold"> ${item.title} </div> <span class="shrink-0 rounded-full border border-border/70 bg-background/50 px-2 py-1 text-[11px] text-muted-foreground"> ${item.time} </span> </div> <div class="mt-1 truncate text-xs text-muted-foreground"> ${item.author} · ${item.chapter} </div> </div> <div class="hidden shrink-0 text-sm font-semibold text-primary opacity-0 transition group-hover:opacity-100 sm:block">
Read →
</div> </a>`)} </div> </div> <aside class="rounded-3xl border border-border/70 bg-card/40 p-5 shadow-sm"> <h3 class="text-sm font-semibold tracking-tight">Popular Tags</h3> <p class="mt-1 text-xs text-muted-foreground">
Explore the most frequently used tags
</p> <div class="mt-5 flex flex-wrap gap-2"> ${popularTags.map((tag2) => renderTemplate`<a${addAttribute(`/tag/${tag2.slug}`, "href")} class="rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"> ${tag2.name} </a>`)} </div> <div class="mt-4 flex justify-end"> <a href="/tags" class="text-xs font-semibold text-primary hover:underline underline-offset-4 flex items-center gap-1">
View all tags <span>→</span> </a> </div> <div class="mt-6 rounded-2xl border border-border/70 bg-background/40 p-4"> <div class="text-sm font-semibold">Library sync</div> <div class="mt-1 text-xs text-muted-foreground"> ${user ? "Your library is up to date. Keep reading where you left off." : "Sign in to track updates, save novels, and record reading progress."} </div> <div class="mt-4"> ${user ? renderTemplate`<a href="/library" class="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
Go to my library
</a>` : renderTemplate`${renderComponent($$result2, "AuthDialog", AuthDialog, { "client:load": true, "triggerText": "Sign in now", "triggerClassName": "inline-flex cursor-pointer h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90", "client:component-hydration": "load", "client:component-path": "@/components/auth-dialog", "client:component-export": "AuthDialog" })}`} </div> </div> </aside> </div> </section> </main> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/index.astro";
const $$url = "";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
