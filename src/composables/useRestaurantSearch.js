import { ref } from "vue";
import restaurantApi from "../api/modules/restaurant";

export function useRestaurantSearch() {
  const restaurants = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const hasMore = ref(true);

  const searchRestaurants = async (queryParams, isLoadMore = false) => {
    isLoading.value = true;
    error.value = null;

    try {
      let rawTags = queryParams.tags;
      let tagsArray = Array.isArray(rawTags) ? rawTags : (rawTags ? [rawTags] : []);

      const limit = 20;
      const skip = isLoadMore ? restaurants.value.length : 0;

      const apiParams = {
        q: queryParams.q,
        city: queryParams.city,
        price_level: queryParams.price_level,
        tags: tagsArray,
        skip: skip,
        limit: limit
      };

      const t0 = performance.now();
      const res = await restaurantApi.searchRestaurants(apiParams);
      const latency = Math.round(performance.now() - t0);

      if(isLoadMore) {
        restaurants.value.push(...res.data);
      } else {
        restaurants.value = res.data;
      }

      // debug log
      const scored = res.data.filter(r => r.match_score != null);
      const mode = scored.length > 0 ? 'semantic+rerank' : (queryParams.q ? 'semantic' : 'filter-only');
      const activeFilters = [
        queryParams.city ? `city:${queryParams.city}` : null,
        queryParams.price_level ? `price:${queryParams.price_level}` : null,
        tagsArray.length > 0 ? `tags:${tagsArray.join(',')}` : null,
      ].filter(Boolean).join(' ');

      console.log(
        `[Search] query="${queryParams.q || ''}" | mode=${mode}` +
        (activeFilters ? ` | filters=${activeFilters}` : '') +
        ` | results=${res.data.length} | latency=${latency}ms`
      );
      if (scored.length > 0) {
        scored.forEach((r, i) => console.log(`  #${i + 1}  similarity=${r.match_score}  ${r.Name}`));
      }

      hasMore.value = res.data.length ===limit;

      return restaurants.value;
    } catch (err) {
      console.error("搜尋發生錯誤:", err);
      error.value = err;
      restaurants.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const searchByBounds = async (combinedParams) => {
    isLoading.value = true;
    try {
      const res = await restaurantApi.getRestaurantsInBounds(combinedParams);
      
      if (res.data && Array.isArray(res.data)) {
        restaurants.value = res.data;
      }
      console.log(`範圍內顯示 ${restaurants.value.length} 筆資料 (含關鍵字/城市過濾)`);
    } catch (err) {
      console.error("地圖範圍搜尋失敗:", err);
    } finally {
      setTimeout(() => {
        isLoading.value = false;
      }, 200);
    }
  };

  return {
    restaurants,
    isLoading,
    error,
    hasMore,
    searchRestaurants,
    searchByBounds,
  };
}