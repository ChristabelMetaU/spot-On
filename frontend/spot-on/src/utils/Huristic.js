/** @format */

class Node {
  constructor(id, lat, lng, Price, edges = []) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.Price = Price;
    this.edges = edges;
  }
}

function connectNodes(nodeA, nodeB, weight) {
  nodeA.edges.push({ node: nodeB, weight });
  nodeB.edges.push({ node: nodeA, weight });
}

export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getTimePenalty(hour) {
  if (hour >= 7 && hour <= 10) return 0.5;
  if (hour >= 11 && hour <= 14) return 0.2;
  if (hour >= 16 && hour <= 18) return 0.4;
  return 0;
}

async function fetchReports(lat, lng) {
  const res = await fetch(
    `http://localhost:3000/report/spot/latlng/${lat}/${lng}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch reports");
  } else {
    return await res.json();
  }
}

async function getSpotUnreliabilityScore(spot) {
  const TEN_MINUTES_DECAY = 600000;
  const reports = await fetchReports(spot.coordLat, spot.coordLng);
  if (!reports) {
    return 0;
  }
  const now = Date.now();
  return reports.reduce((penalty, r) => {
    const age = now - new Date(r.created_at).getTime();
    return penalty + Math.exp(-age / TEN_MINUTES_DECAY);
  }, 0);
}

function smartHeuristic(node, goal, unreliability, timePenalty) {
  const dist = getDistance(node.lat, node.lng, goal.lat, goal.lng);
  return dist * (1 + unreliability + timePenalty);
}

function calculatePriority(cost, heuristic, urgencyFactor = 1) {
  return cost * urgencyFactor + heuristic * 1.2;
}

export async function getDrivingData(lat1, lng1, lat2, lng2) {
  const res = await fetch(
    `http://localhost:3000/report/spot/direction/${lat1}/${lat2}/${lng1}/${lng2}`
  );
  const data = await res.json();
  if (!data) {
    throw new Error("Failed to fetch driving data");
  }
  const element = data.rows[0].elements[0];
  return {
    distanceKm: element.distance.value / 1000,
    durationMin: element.duration.value / 60,
    durationInTrafficMin: element.duration_in_traffic?.value
      ? element.duration_in_traffic.value / 60
      : element.duration.value / 60,
  };
}

export async function buildGraph(
  userLocation,
  nearbySpots,
  destinationLocation
) {
  if (!userLocation || !nearbySpots || !destinationLocation) {
    return null;
  }
  const userNode = new Node("user", userLocation.lat, userLocation.lng, 0);
  const nodes = [userNode];
  const spotNodes = [];
  const hour = new Date().getHours();

  for (const spot of nearbySpots) {
    const node = new Node(spot.id, spot.coordLat, spot.coordLng, spot.Price);
    const unreliable = await getSpotUnreliabilityScore(spot);
    node.unreliability = unreliable;
    //defining  a threshold of 1.5 if spot is too unreliable, skip
    if (unreliable > 1.5) {
      continue;
    }
    nodes.push(node);
    spotNodes.push(node);

    const drivingData = await getDrivingData(
      userLocation.lat,
      userLocation.lng,
      spot.coordLat,
      spot.coordLng
    );
    const destinationData = await getDrivingData(
      spot.coordLat,
      spot.coordLng,
      destinationLocation.lat,
      destinationLocation.lng
    );
    node.drivingMinutesFromUser = drivingData.durationInTrafficMin;
    node.drivingMinutesFromDestination = destinationData.durationInTrafficMin;
    const unreliability = await getSpotUnreliabilityScore(spot);
    const timePenalty = getTimePenalty(hour);
    const weight =
      drivingData.durationInTrafficMin * (1 + unreliability + timePenalty);
    connectNodes(userNode, node, weight);
  }
  return { userNode, spotNodes, allNodes: nodes };
}

export function dynamicPathFinder(startNode, goalNodes, options = {}) {
  const queue = [];
  queue.push({ node: startNode, cost: 0 });
  const visited = new Set();
  const cameFrom = {};
  const costSoFar = {};
  costSoFar[startNode.id] = 0;
  const hour = new Date().getHours();
  const foundPaths = [];

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { node: current } = queue.shift();

    if (visited.has(current.id)) {
      continue;
    }
    visited.add(current.id);

    const matchingGoal = goalNodes.find((goal) => goal.id === current.id);
    if (matchingGoal) {
      let path = [current];
      let totalCost = costSoFar[current.id];
      while (cameFrom[path[0].id]) {
        path.unshift(cameFrom[path[0].id]);
      }
      foundPaths.push({
        path,
        goal: current,
        totalCost,
        totalPrice: path.reduce((sum, n) => sum + n.Price, 0),
      });
      continue;
    }

    for (const edge of current.edges) {
      const neighbor = edge.node;
      const newCost = costSoFar[current.id] + edge.weight;
      const unreliability = neighbor.unreliability || 0;
      const heuristic = smartHeuristic(
        neighbor,
        goalNodes[0],
        unreliability,
        getTimePenalty(hour)
      );
      const priority = calculatePriority(newCost, heuristic, 1.1);

      if (!(neighbor.id in costSoFar) || newCost < costSoFar[neighbor.id]) {
        costSoFar[neighbor.id] = newCost;
        cameFrom[neighbor.id] = current;
        queue.push({ node: neighbor, cost: priority });
      }
    }
  }
  return foundPaths;
}
