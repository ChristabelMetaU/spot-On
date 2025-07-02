/** @format */
import { formatDistanceToNow } from "date-fns";
export const getFormattedDate = (timeStamp) => {
  const date = new Date(timeStamp);
  const now = new Date();
  const diffrenceInms = now.getTime() - date.getTime();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  if (diffrenceInms < oneWeekInMs) {
    return `${formatDistanceToNow(date, { addSuffix: true })}`;
  } else {
    return `on ${`format(date, 'do MMMM, yyyy')`}`;
  }
};
