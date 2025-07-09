/** @format */

function getDistance(lat1, lng1, lat2, lng2) {
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

//TODO: will be replaced with actual data
export function buildGraph(userLocation, nearbySpots) {
  const nodes = [];
  const userNode = new Node("user", userLocation.lat, userLocation.lng);
  nodes.push(userNode);

  const spotNodes = nearbySpots.map((spot, i) => {
    const node = new Node(`spot-${i}`, spot.coordLat, spot.coordLng);
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

//Heurestic guided greedy search
export function customPathFinder(startNode, goalNodes) {
  const visited = new Set();
  const cameFrom = {};
  const costSoFar = {};
  const queue = [];
  costSoFar[startNode.id] = 0;
  queue.push({ node: startNode, cost: 0 });
  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift().node;
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

        const Heurestic = Math.min(
          ...goalNodes.map((g) =>
            getDistance(neighbor.lat, neighbor.lng, g.lat, g.lng)
          )
        );

        const priority = newCost + Heurestic; //will be customized later
        queue.push({ node: neighbor, cost: priority });
      }
    }
  }
  return null;
}
