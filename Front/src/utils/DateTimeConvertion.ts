export const convertToDateTime = (date: string, time: string) => {
  const dateTimeString = `${date} ${time}:00`;
  const [datePart, timePart] = dateTimeString.split(" ");
  const [yearStr, monthStr, dayStr] = datePart.split("-");
  const [hourStr, minuteStr, secondStr] = timePart.split(":");

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const second = parseInt(secondStr, 10);

  return new Date(year, month - 1, day, hour, minute, second);
};

export const convertToDateString = (dateTime: string) => {
  return new Date(dateTime).toISOString().split("T")[0];
};

export const convertToTimeString = (dateTime: string) => {
  const hours = new Date(dateTime).getHours().toString().padStart(2, "0");
  const minutes = new Date(dateTime).getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  return timeString;
};
