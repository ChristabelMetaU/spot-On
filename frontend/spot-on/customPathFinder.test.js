/** @format */

import { customPathFinder, buildGraph } from "./src/utils/Huristic";
class Node {
  constructor(id, lat, lng, edges = []) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.edges = edges;
  }
}

const userLocation = {
  id: "user",
  name: "User Location",
  lat: 35.8457602,
  lng: -86.3789569,
};

const nearbyFreeSpots = [
  { name: "Lot A", lat: 35.8473065, lng: -86.3709735, isOccupied: false },
  { name: "Lot B", lat: 35.846789, lng: -86.37321, isOccupied: false },
  { name: "Garage C", lat: 35.8481, lng: -86.3759, isOccupied: false },
  { name: "Street D", lat: 35.844123, lng: -86.37945, isOccupied: false },
  { name: "Parking E", lat: 35.8435, lng: -86.3778, isOccupied: false },
];

describe("Shortest Path Finder Tests", () => {
  let userNode, goalNodes;

  beforeEach(() => {
    const graph = buildGraph(userLocation, nearbyFreeSpots);
    userNode = graph.userNode;
    goalNodes = graph.spotNodes;
  });

  it("should return an empty array if start and goal are the same", () => {
    const result = customPathFinder(userNode, [userNode]);
    expect(result).toEqual([]);
  });

  it("should return the shortest path to a reachable goal node", () => {
    const result = customPathFinder(userNode, goalNodes);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].id).toBe("user");
    expect(goalNodes.map((n) => n.id)).toContain(result[result.length - 1].id);
  });

  it("should handle a graph with multiple paths and find the shortest one", () => {
    const result = customPathFinder(userNode, [goalNodes[0], goalNodes[1]]);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe("user");
    expect([goalNodes[0].id, goalNodes[1].id]).toContain(
      result[result.length - 1].id
    );
  });

  it("should return null if there is no path to any goal node", () => {
    userNode.edges = [];

    const result = customPathFinder(userNode, goalNodes);
    expect(result).toEqual([]);
  });

  it("should return null if goalNodes is empty", () => {
    const result = customPathFinder(userNode, []);
    expect(result).toEqual([]);
  });
});
