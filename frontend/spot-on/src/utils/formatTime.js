/** @format */

export const formatTime = (second) => {
  if (second > 3600) {
    const hours = Math.floor(second / 3600);
    const minutes = Math.floor((second % 3600) / 60);
    const seconds = Math.floor(second % 60);
    return (
      (hours < 10 ? "0" + hours : hours) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  } else {
    const minutes = Math.floor(second / 60);
    const seconds = Math.floor(second % 60);
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }
};
