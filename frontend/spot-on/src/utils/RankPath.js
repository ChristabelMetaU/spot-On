/** @format */

export function rankPaths(paths, serLocation, destinationLocation) {
  const ranked = {
    closestToUser: [...paths].sort((a, b) => {
      const aTime = a.goal.drivingMinutesFromUser;
      const bTime = b.goal.drivingMinutesFromUser;
      return aTime - bTime;
    }),

    closestToDestination: [...paths].sort((a, b) => {
      const aTime = a.goal.drivingMinutesFromDestination;
      const bTime = b.goal.drivingMinutesFromDestination;
      return aTime - bTime;
    }),

    cheapest: [...paths].sort((a, b) => a.totalCost - b.totalCost),

    secondClosestToUser: [],
    secondClosestToDestination: [],
  };

  ranked.secondClosestToUser = ranked.closestToUser[1]
    ? [ranked.closestToUser[1]]
    : [];
  ranked.secondClosestToDestination = ranked.closestToDestination[1]
    ? [ranked.closestToDestination[1]]
    : [];
  return ranked;
}
