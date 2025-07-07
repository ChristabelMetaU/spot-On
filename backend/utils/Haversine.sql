// utils/haversine.js
export const haversineSQL = (lat, lng) => `
  6371000 * acos(
    cos(radians(${lat})) * cos(radians("coordLat")) *
    cos(radians("coordLng") - radians(${lng})) +
    sin(radians(${lat})) * sin(radians("coordLat"))
  )
`;
