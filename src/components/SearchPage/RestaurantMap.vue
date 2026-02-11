<script setup>
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

const props = defineProps(['restaurants']);
const emit = defineEmits(['bounds-changed']);
const mapElement = ref(null);

let map = null;
let clusterGroup = null;

onMounted(() => {
  map = L.map(mapElement.value).setView([25.03, 121.56], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false, 
    chunkedLoading: true
  });
  map.addLayer(clusterGroup);

  // 監聽地圖縮放或拖移結束，回傳經緯度範圍給父組件
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

// 當父組件傳入的新餐廳資料更新時，重繪地圖標記
watch(() => props.restaurants, (newRestaurants) => {
  if (!clusterGroup) return;

  clusterGroup.clearLayers();
  const newMarkers = [];
  
  newRestaurants.forEach(res => {
    const lat = res.Py;
    const lng = res.Px;

    if (lat && lng) {
      const marker = L.marker([lat, lng])
        .bindPopup(`
          <div style="font-family: sans-serif;">
            <strong style="font-size: 14px; color: #333;">${res.Name || '未知餐廳'}</strong><br>
            <span style="color: #666; font-size: 12px;">${res.Add || '暫無地址'}</span><br>
            <a href="${res.GoogleMap || '#'}" target="_blank" 
               style="display:block; margin-top:8px; color:#f38332; text-decoration:none; font-weight:bold;">
               在 Google Map 開啟
            </a>
          </div>
        `);
      newMarkers.push(marker);
    }
  });
  clusterGroup.addLayers(newMarkers);
}, { deep: true });

// flyTo 讓父組件（SearchPage）可以控制地圖移動
defineExpose({
  flyTo: (lat, lng) => {
    if (map) {
      map.flyTo([lat, lng], 16, {
        animate: true,
        duration: 1.5 
      });
    }
  }
});

const onMapMoveEnd = () => {
  const bounds = mapInstance.getBounds ();
  const coords ={
    min_lat: bounds.getSouth(),
    max_lat: bounds.getNorth(),
    min_lng: bounds.getWest(), 
    max_lng: bounds.getEast()
  };
  emit ('bounds-changed', coords);
}
</script>

<template>
  <div id="map-container" ref="mapElement"></div>
</template>

<style scoped>
#map-container {
  width: 100%;
  height: 100%;
  z-index: 1; 
  min-height: 400px; 
}

/* 移除 Leaflet 容器選取時的藍色外框 */
:deep(.leaflet-container) {
  outline: 0;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  padding: 5px;
}
</style>