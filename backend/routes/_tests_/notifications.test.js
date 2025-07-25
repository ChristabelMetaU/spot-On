/** @format */

describe("Notification Filter Logic", () => {
  it("should filter out duplicate notifications with same spotId and id", () => {
    const mockNotifications = [
      { id: 1, spotId: 101 },
      { id: 2, spotId: 101 },
      { id: 1, spotId: 101 }, // duplicate
      { id: 3, spotId: 102 },
    ];

    const unique = mockNotifications.filter(
      (notification, index, self) =>
        index ===
        self.findIndex(
          (t) => t.spotId === notification.spotId && t.id === notification.id
        )
    );

    expect(unique).toEqual([
      { id: 1, spotId: 101 },
      { id: 2, spotId: 101 },
      { id: 3, spotId: 102 },
    ]);
  });
});
