document.addEventListener('DOMContentLoaded', () => {
  const CONFIG = {
    columns: 'tubetube-columns-count',
    shorts: 'tubetube-shorts-display',
    def: 4,
    max: 10,
    min: 1,
    idSelectColumns: "tubetube-select-columns",
    idSwitchShorts: "tubetube-switch-shorts",
    idClearStorage: "tubetube-clear-storage",
  };

  const state = {
    columns: CONFIG.def,
    shorts: true,
  };

  const columnsSelect = document.getElementById(CONFIG.idSelectColumns);
  const shortsCheckbox = document.getElementById(CONFIG.idSwitchShorts);

  // 初始化下拉列表
  for (let i = CONFIG.min; i <= CONFIG.max; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i} 个`;
    columnsSelect.appendChild(option);
  }

  // 初始化 UI 设置参数
  chrome.storage.local.get([CONFIG.columns, CONFIG.shorts]).then((data) => {
    state.columns = Math.min(CONFIG.max, Math.max(CONFIG.min, data[CONFIG.columns] || CONFIG.def));
    state.shorts = !(data[CONFIG.shorts] === false);

    columnsSelect.value = state.columns;
    shortsCheckbox.checked = state.shorts;
  });

  // 监听切换每行视频数
  columnsSelect.addEventListener('change', (e) => {
    const value = parseInt(e.target.value);
    state.columns = value;
    chrome.storage.local.set({ [CONFIG.columns]: value });
  });

  // 监听切换 Shorts 显示
  shortsCheckbox.addEventListener('change', (e) => {
    const value = e.target.checked;
    state.shorts = value;
    chrome.storage.local.set({ [CONFIG.shorts]: value });
  });

  // 清除所有设置
  document.getElementById(CONFIG.idClearStorage).addEventListener('click', () => {
    if (confirm('清除 TubeTube 所有设置?')) {
      chrome.storage.local.clear().then(() => {
        state.columns = CONFIG.def;
        state.shorts = true;

        columnsSelect.value = CONFIG.def;
        shortsCheckbox.checked = true;
      });
    }
  });
});
