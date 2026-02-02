import { ref } from "vue";
import restaurantApi from "../api/modules/restaurant";

export function useRestaurantSearch() {
  const restaurants = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const searchRestaurants = async (queryParams) => {
    isLoading.value = true;
    error.value = null;

    try {
      let rawTags = queryParams.tags;
      let tagsArray = [];

      if (Array.isArray(rawTags)) {
        tagsArray = rawTags;
      } else if (rawTags) {
        tagsArray = [rawTags];
      }
      const apiParams = {
        q: queryParams.q,
        city: queryParams.city,
        price_level: queryParams.price_level,
        tags: tagsArray,
      };

      const res = await restaurantApi.searchRestaurants(apiParams);

      restaurants.value = res.data;

      return restaurants.value;
    } catch (err) {
      console.error("搜尋發生錯誤:", err);
      error.value = err;
      restaurants.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const searchByBounds = async (bounds) => {
    isLoading.value = true;
    try {
      const res = await restaurantApi.getRestaurantsInBounds(bounds);
      if (res.data && Array.isArray(res.data)) {
        restaurants.value = res.data;
      }
      console.log(`範圍內顯示 ${restaurants.value.length} 筆資料`);
    } catch (err) {
      console.error("地圖範圍搜尋失敗:", err);
    } finally {
        setTimeout(()=>{
            isLoading.value = false;
        }, 200);
    }

  };

  return {
    restaurants,
    isLoading,
    error,
    searchRestaurants,
    searchByBounds,
  };
}
