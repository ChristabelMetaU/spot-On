/** @format */
import { customPathFinder } from "./src/utils/Huristic";
// Define the Node class for testing purposes
class Node {
  constructor(id, lat, lng, edges = []) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.edges = edges; // edges should be an array of other nodes
  }
}

// Graph Construction for Test Data
let nodeA, nodeB, nodeC, nodeD, userNode;

beforeEach(() => {
  // Create nodes for testing
  nodeA = new Node(82, 35.84730650881668, -86.37097349907495, []); // Node A (parking spot 1)
  nodeB = new Node(83, 35.847, -86.375, [nodeA]); // Node B (connected to nodeA)
  nodeC = new Node(84, 35.8457602, -86.3789569, [nodeB]); // Node C (connected to nodeB)
  nodeD = new Node(85, 35.84, -86.38, [nodeA]); // Node D (connected to nodeA)
  userNode = new Node("user", 35.8457602, -86.3789569, [nodeB, nodeC]); // User node, connected to nodeB and nodeC
});

// Custom Path Finder Test Cases
describe("Shortest Path Finder Tests", () => {
  it("should return no path if start and goal are the same", () => {
    const result = customPathFinder(userNode, [userNode]); // User node to itself
    expect(result).toEqual([]); // No need to find a path if start == goal
  });

  it("should return no path if goal node is not reachable", () => {
    // Node D is not reachable from the user node
    const result = customPathFinder(userNode, [nodeD]);
    expect(result).toBeNull(); // Node D is disconnected, so no valid path
  });

  it("should return the shortest path to a goal node when multiple goal nodes are present", () => {
    // Find shortest path to nodeA or nodeD. nodeA should be reached first via nodeB.
    const result = customPathFinder(userNode, [nodeA, nodeD]);
    expect(result).toEqual([userNode, nodeB, nodeA]); // Shortest path to nodeA
  });

  it("should handle a graph with multiple paths", () => {
    // Add multiple paths to nodeA from nodeB or nodeC
    nodeB.edges.push(nodeC); // Adding connection from nodeB to nodeC (nodeC already connected to user)
    const result = customPathFinder(userNode, [nodeA]);
    expect(result).toEqual([userNode, nodeB, nodeA]); // Shortest path should still go through nodeB -> nodeA
  });

  it("should return null if there’s no path due to disconnected nodes", () => {
    // Disconnect nodeB and nodeC from any other node (including userNode)
    nodeB.edges = []; // NodeB is now isolated
    const result = customPathFinder(userNode, [nodeA]); // No path from userNode to nodeA
    expect(result).toBeNull(); // Expecting no valid path due to disconnection
  });
});
