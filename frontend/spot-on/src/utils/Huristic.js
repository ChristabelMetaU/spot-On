/** @format */

const FREQUENCY_THRESHOLD = 4;
const WINDOW_MINUTES = 10;
const WINDOW_SIZE = 60 * 1000 * WINDOW_MINUTES; // 10 minutes
function isTooFrequent(times) {
  const now = Date.now();
  const recentReports = times.filter((time) => now - time <= WINDOW_SIZE);
  return recentReports.length >= FREQUENCY_THRESHOLD;
}

const fetchReports = async (lat, lng) => {
  const reports = await fetch(
    `http://localhost:3000/report/spot/latlng/${lat}/${lng}`
  );
  const reportsSpots = await reports.json();
  if (reportsSpots.length === 0) {
    return [];
  }
  return reportsSpots;
};
const processSpotReports = async (spot) => {
  if (!spot) {
    return false;
  }
  const reports = await fetchReports(spot.lat, spot.lng);
  if (reports.length === 0) {
    return false;
  }
  //get createdat times for spot's reports
  const times = reports.map((report) => report.created_at);

  if (isTooFrequent(times)) {
    return true;
  } else {
    return false;
  }
};
export function getDistance(lat1, lng1, lat2, lng2) {
  const RaduisEarth = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return RaduisEarth * c;
}

class Node {
  constructor(id, lat, lng, edges = []) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.edges = edges;
  }
}

function addedge(nodeA, nodeB, weight) {
  nodeA.edges.push({ node: nodeB, weight });
  nodeB.edges.push({ node: nodeA, weight });
}

export function buildGraph(userLocation, nearbySpots) {
  const nodes = [];
  const userNode = new Node("user", userLocation.lat, userLocation.lng);
  nodes.push(userNode);
  if (nearbySpots.length === 0) {
    return { userNode, spotNodes: [], allNodes: nodes };
  }
  const spotNodes = nearbySpots.map((spot, i) => {
    const node = new Node(spot.id, spot.coordLat, spot.coordLng);
    nodes.push(node);
    const dist = getDistance(
      userLocation.lat,
      userLocation.lng,
      spot.coordLat,
      spot.coordLng
    );
    addedge(userNode, node, dist);
    return node;
  });

  return { userNode, spotNodes, allNodes: nodes };
}

export function customPathFinder(startNode, goalNodes) {
  const visited = new Set();
  const cameFrom = {};
  const costSoFar = {};
  const queue = [];
  if (startNode.id === goalNodes[0].id || goalNodes.length == 0) {
    return [];
  }
  costSoFar[startNode.id] = 0;
  queue.push({ node: startNode, cost: 0 });
  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { node: current } = queue.shift();
    if (visited.has(current.id)) {
      continue;
    }
    visited.add(current.id);

    if (goalNodes.some((g) => g.id === current.id)) {
      let path = [current];
      while (cameFrom[path[0].id]) {
        path.unshift(cameFrom[path[0].id]);
      }
      return path;
    }

    for (const edge of current.edges) {
      const neighbor = edge.node;
      const newCost = costSoFar[current.id] + edge.weight;

      if (!costSoFar[neighbor.id] || newCost < costSoFar[neighbor.id]) {
        costSoFar[neighbor.id] = newCost;
        cameFrom[neighbor.id] = current;

        const Heurestic = getDistance(
          neighbor.lat,
          neighbor.lng,
          goalNodes[0].lat,
          goalNodes[0].lng
        );
        let adjustedCost = newCost;
        const isTooFrequent = processSpotReports(neighbor);
        if (isTooFrequent) {
          adjustedCost -= 0.5;
          adjustedCost = Math.max(0, adjustedCost);
        } else {
          adjustedCost += 0.2;
        }
        const priority = adjustedCost + Heurestic;
        queue.push({ node: neighbor, cost: priority });
      }
    }
  }
  return [];
}
