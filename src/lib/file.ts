/**
 * 统计文本中的【词语数量 (Token Count)】。
 * * 计算方式：将文本内容按非词语边界（如空格、标点）分割，统计有效的词语单元数量。
 * 适用于中英文混合文本，将英文单词、数字和中文连续的汉字块都视为一个词语单元。
 * * **注意：此函数不进行中文分词。对于连续的中文文本，它会将整个中文段落视为一个或少数几个词语单元。
 * 如果需要统计小说中的中文总字数，请使用 countTotalMeaningfulCharacters。**
 * * @param {string} text 待统计的纯文本字符串
 * * @returns {number} 词语（单词/词组）数量
 */
export function countWords(text: string) {
  if (!text) return 0;

  // 正则表达式解释:
  // /[\w\u4e00-\u9fa5']+/g
  // \w: 匹配任何字母、数字或下划线
  // \u4e00-\u9fa5: 匹配所有中文字符
  // ': 允许英文所有格或缩写
  // +: 匹配一个或多个连续字符
  const matches = text.match(/[\w\u4e00-\u9fa5']+/g);

  // 如果匹配成功，返回匹配到的单元数量，否则返回 0
  return matches ? matches.length : 0;
}

/**
 * 【用于总字数统计】统计所有非空白字符的总数量 (Character Count)。
 * 这是中文小说和文档最常用的字数统计方法。
 * @param {string} text 待统计的文本字符串
 * @returns {number} 字符总数量（不含空白）
 */
function countTotalMeaningfulCharacters(text: string) {
  if (!text) return 0;
  const cleanedText = text.replace(/\s/g, ""); // 移除所有空白字符
  return cleanedText.length;
}

/**
 * 统计中文、日文和韩文核心字符数量（CJK 字符）。
 * @param {string} text 待统计的文本字符串
 * @returns {number} CJK 字符数量
 */
function countCJKCharacters(text: string) {
  if (!text) return 0;

  // 包含范围:
  // \u4e00-\u9fa5: 中日韩统一表意文字 (Hanzi/Kanji/Hanja)
  // \u3040-\u309F: 日文平假名 (Hiragana)
  // \u30A0-\u30FF: 日文片假名 (Katakana)
  // \uac00-\ud7a3: 韩文音节 (Hangul Syllables)
  const cjkRegex = /[\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF\uac00-\ud7a3]/g;

  const matches = text.match(cjkRegex);
  return matches ? matches.length : 0;
}

/**
 * 根据文本语言密度智能选择最合适的字数统计方法。
 * * 规则:
 * 1. 计算文本中 CJK 字符 (中日韩) 占所有有效字符的比例。
 * 2. 如果比例高于阈值 (如 60%)，则认定为 CJK 小说，返回【总有效字符数】。
 * 3. 否则，认定为西方语言主导，返回【词语数量 (Token Count)】。
 * * @param {string} text 待统计的纯文本字符串
 * @param {number} [chineseThreshold=0.6] CJK 字符比例阈值 (0.0 到 1.0)
 * @returns {{count: number, method: 'Character' | 'Token'}} 包含数量和所用方法的对象
 */
export function getNovelWordCount(text: string, chineseThreshold = 0.6) {
  const totalMeaningfulCharacters = countTotalMeaningfulCharacters(text);
  if (totalMeaningfulCharacters === 0) {
    return { count: 0, method: "Character" };
  }

  // 关键更改：使用 CJK 字符计数
  const cjkCharacters = countCJKCharacters(text);
  const cjkRatio = cjkCharacters / totalMeaningfulCharacters;

  if (cjkRatio >= chineseThreshold) {
    // 认定为 CJK 小说（中文、日文、韩文），使用字符数
    return {
      count: totalMeaningfulCharacters,
      method: "Character",
    };
  } else {
    // 认定为非 CJK 主导（如英文），使用 Token 数
    return {
      count: countWords(text),
      method: "Token",
    };
  }
}
