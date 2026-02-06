(() => {
  'use strict';

  const CONFIG = {
    columns: 'tubetube-columns-count', // 每行视频数量
    shorts: 'tubetube-shorts-display', // 是否显示短视频（true 代表显示，false 代表隐藏）
    def: 4, // 每行视频数量默认值
    max: 10, // 每行视频数量最大值
    min: 1, // 每行视频数量最小值
    styleAttribute: 'data-tubetube-style', // 插入的 style 标签的属性
  };

  const state = {
    columns: CONFIG.def,
    shorts: true,
  };

  const addStyle = (css, attributeValue) => {
    const style = document.createElement('style');
    style.textContent = css;
    style.setAttribute(CONFIG.styleAttribute, attributeValue);
    document.head.appendChild(style);
  };

  const updateStyle = () => {
    // 移除旧样式
    const existingStyles = document.querySelectorAll(`style[${CONFIG.styleAttribute}]`);
    existingStyles.forEach(style => style.remove());

    // 添加新样式，并标记以便后续移除
    const columnsStyle = `
      /* 每行视频数量 */
      .style-scope.ytd-two-column-browse-results-renderer {
        --ytd-rich-grid-items-per-row: ${state.columns} !important;
        --ytd-rich-grid-gutter-margin: 0px !important;
      }
      /* 头像大小 */
      .yt-spec-avatar-shape--avatar-size-medium {
        width: ${37 - state.columns}px;
        height: ${37 - state.columns}px;
      }
      /* 标题大小 */
      .yt-lockup-metadata-view-model--standard.yt-lockup-metadata-view-model--rich-grid-legacy-typography .yt-lockup-metadata-view-model__title {
        font-size: 1.${9 - state.columns}rem;
      }
      /* 博主名字大小 */
      .yt-content-metadata-view-model--medium-text .yt-content-metadata-view-model__metadata-text {
        font-size: 1.${7 - state.columns}rem;
      }
    `;

    addStyle(columnsStyle, 'columns');

    if (!state.shorts) {
      const shortsStyle = `
        ytd-rich-section-renderer,
        ytd-reel-shelf-renderer {
          display: none !important;
        }
      `;

      addStyle(shortsStyle, 'shorts');
    }
  };

  // 初始加载存储值并更新
  chrome.storage.local.get([CONFIG.columns, CONFIG.shorts]).then((data) => {
    state.columns = Math.min(CONFIG.max, Math.max(CONFIG.min, data[CONFIG.columns] || CONFIG.def));
    state.shorts = !(data[CONFIG.shorts] === false);
    updateStyle();
  });

  // 监听存储变化，实时更新
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      let updated = false;
      if (CONFIG.columns in changes) {
        state.columns = Math.min(CONFIG.max, Math.max(CONFIG.min, changes[CONFIG.columns].newValue || CONFIG.def));
        updated = true;
      }
      if (CONFIG.shorts in changes) {
        state.shorts = !(changes[CONFIG.shorts].newValue === false);
        updated = true;
      }
      if (updated) {
        updateStyle();
      }
    }
  });
})();
