globalThis.process ??= {};
globalThis.process.env ??= {};
const RANK_TYPE = {
  // 定期更新, 存到ranking表中
  WEEKLY: "weekly",
  // 周热度榜 - 按一周点击数排名
  MONTHLY: "monthly",
  // 月热度榜 - 按一个月点击数排名
  RISING_STAR: "rising_star",
  // 潜力榜 - view_count / max(now - created_at, 86400)
  // 实时获取(索引优化)
  VIEW: "view",
  // 总点击榜 - 按点击总数排名
  BOOKMARK: "bookmark",
  // 总收藏榜 - 按收藏总数排名
  HIGH_RATED: "high_rated",
  // 高分榜 - 按评分排名
  EDITOR_PICK: "editor_pick"
  // 编辑器推荐榜 - 显示置顶小说
};
export {
  RANK_TYPE as R
};
