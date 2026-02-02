import { ref } from "vue";
import restaurantApi from "../api/modules/restaurant";

export function useRestaurantSearch() {
  const restaurants = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const searchRestaurants = async (queryParams) =>{
    isLoading.value = true;
    error.value = null;

    try{
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
            tags: tagsArray
        };

        const res = await restaurantApi.searchRestaurants(apiParams);

        restaurants.value = res.data;

        return restaurants.value;
    } catch(err) {
        console.error("搜尋發生錯誤:", err);
        err.value = err;
        restaurants.value = [];
    } finally {
        isLoading.value = false;
    }
  };

  return {
    restaurants,
    isLoading,
    error,
    searchRestaurants
  };
}
