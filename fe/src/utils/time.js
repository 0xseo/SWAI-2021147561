export function getTimeStamp() {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDate = `${padValue(year)}-${padValue(month)}-${padValue(
    day
  )} ${padValue(hours)}:${padValue(minutes)}:${padValue(seconds)}`;

  return formattedDate;
}
function padValue(value) {
  return value < 10 ? "0" + value : value;
}
