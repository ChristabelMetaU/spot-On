/** @format */
const earthRadius = 6371000;
function toRad(x) {
  return (x * Math.PI) / 180;
}

const haversine = (lat1, lng1, lat2, lng2) => {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const clusterSpots = (spots, clusterRadius = 100) => {
  const clusters = [];
  spots.forEach((spot) => {
    const lat = Number(spot.coordLat);
    const lng = Number(spot.coordLng);
    let added = false;
    for (const cluster of clusters) {
      const dist = haversine(lat, lng, cluster.centerLat, cluster.centerLng);
      if (dist <= clusterRadius) {
        cluster.spots.push(spot);
        const count = cluster.spots.length;
        cluster.centerLat = (cluster.centerLat * (count - 1) + lat) / count;
        cluster.centerLng = (cluster.centerLng * (count - 1) + lng) / count;
        added = true;
        break;
      }
    }
    if (!added) {
      clusters.push({
        centerLat: lat,
        centerLng: lng,
        spots: [spot],
      });
    }
  });
  return clusters;
};
