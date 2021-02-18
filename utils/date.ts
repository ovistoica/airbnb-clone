export const calcNumberOfNightsBetweenDates = (
  startDate: Date | string | number,
  endDate: Date | string | number
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let dayCount = 0;

  while (end > start) {
    dayCount++;
    start.setDate(start.getDate() + 1);
  }

  return dayCount;
};

export const getDatesBetweenDates = (startDate: Date, endDate: Date) => {
  let dates: Date[] = [];
  while (startDate < endDate) {
    dates = [...dates, new Date(startDate)];
    startDate.setDate(startDate.getDate() + 1);
  }
  dates = [...dates, endDate];
  return dates;
};
