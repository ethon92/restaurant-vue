<script setup>
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps(['restaurants']);
const emit = defineEmits(['bounds-changed']);
const mapElement = ref(null);

let map = null;
let markerLayer = null;

onMounted(() => {
  map = L.map(mapElement.value).setView([25.03, 121.56], 13);
<<<<<<< HEAD

=======
  
>>>>>>> 4260cb9 (feat: 實作餐廳搜尋頁面，整合 Leaflet 地圖與左側列表連動)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);

  // 監聽地圖縮放或拖移結束
  map.on('moveend', () => {
    const bounds = map.getBounds();
    emit('bounds-changed', {
      min_lat: bounds.getSouthWest().lat,
      max_lat: bounds.getNorthEast().lat,
      min_lng: bounds.getSouthWest().lng,
      max_lng: bounds.getNorthEast().lng
    });
  });
});

<<<<<<< HEAD

// 當父組件傳入的新餐廳要更新地圖上的點
watch(() => props.restaurants, (newRestaurants) => {
  if (!markerLayer) return;

  markerLayer.clearLayers();

  // RestaurantMap.vue 內的 watch
newRestaurants.forEach(res => {
    // 修正：全部改為大寫
    const lat = res.Py;
    const lng = res.Px;

    if (lat && lng) {
      const marker = L.marker([lat, lng])
        .bindPopup(`
          <div style="font-family: sans-serif;">
            <strong style="font-size: 14px;">${res.Name}</strong><br>
            <span style="color: #666;">${res.Add}</span><br>
            <a href="${res.GoogleMap}" target="_blank" style="... ">在 Google Map 開啟</a>
          </div>
        `);
      markerLayer.addLayer(marker);
    }
});

=======

// 當父組件傳入的新餐廳要更新地圖上的點
watch(() => props.restaurants, (newRestaurants) => {
  if (!markerLayer) return;
  
  markerLayer.clearLayers(); 
  
  newRestaurants.forEach(res => {
    
    const lat = res.Py || res.Py;
    const lng = res.Px || res.Px;

    if (lat && lng) {
      const marker = L.marker([lat, lng])
        .bindPopup(`
          <div style="font-family: sans-serif;">
            <strong style="font-size: 14px;">${res.name}</strong><br>
            <span style="color: #666;">${res.address}</span><br>
            <a href="${res.google_map_url}" target="_blank" style="display:block; margin-top:5px; color:#007bff; text-decoration:none;">在 Google Map 開啟</a>
          </div>
        `);
      markerLayer.addLayer(marker);
    }
  });
>>>>>>> 4260cb9 (feat: 實作餐廳搜尋頁面，整合 Leaflet 地圖與左側列表連動)
}, { deep: true });

// 6. 實作 flyTo 給父組件
defineExpose({
  flyTo: (lat, lng) => {
    if (map) {
      map.flyTo([lat, lng], 16, {
        animate: true,
<<<<<<< HEAD
        duration: 1.5
=======
        duration: 1.5 
>>>>>>> 4260cb9 (feat: 實作餐廳搜尋頁面，整合 Leaflet 地圖與左側列表連動)
      });
    }
  }
});
</script>

<template>
  <div id="map-container" ref="mapElement"></div>
</template>

<style scoped>
#map-container {
  width: 100%;
  height: 100%;
<<<<<<< HEAD
  z-index: 1;

  min-height: 400px;
=======
  z-index: 1; 

  min-height: 400px; 
>>>>>>> 4260cb9 (feat: 實作餐廳搜尋頁面，整合 Leaflet 地圖與左側列表連動)
}


:deep(.leaflet-container) {
  outline: 0;
}
</style>