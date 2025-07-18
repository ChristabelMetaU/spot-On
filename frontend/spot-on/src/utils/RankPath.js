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
    cheapest: [...paths].sort((a, b) => a.totalPrice - b.totalPrice),
  };
  return ranked;
}
