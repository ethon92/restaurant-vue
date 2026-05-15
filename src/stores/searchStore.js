import { defineStore } from "pinia";
import { ref } from "vue";

// 這個 store 負責管理以圖搜尋的結果和彈窗狀態
export const useSearchStore = defineStore("search", () => {
  const imageSearchResults = ref([]);
  const showResultModal = ref(false);

  // 儲存結果並開啟彈窗
  const setSearchResults = (results) => {
    imageSearchResults.value = results;
    showResultModal.value = true;
  };

  // 關閉彈窗並清空結果
  const closeSearchModal = () => {
    showResultModal.value = false;
    imageSearchResults.value = [];
  };

  return {
    imageSearchResults,
    showResultModal,
    setSearchResults,
    closeSearchModal,
  };
});
