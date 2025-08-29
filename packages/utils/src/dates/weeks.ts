import moment from 'moment';

export function getCurrentWeekRange(): string {
  const now = new Date();
  // Get Monday (start of week)
  const monday = new Date(now);
  const day = monday.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diffToMonday);

  // Get Sunday (end of week)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const monDay = moment(monday).format('Do ddd');
  const sunDay = moment(sunday).format('Do ddd');
  const sunMonth = moment(sunday).format('MMM');

  if (monday.getMonth() === sunday.getMonth()) {
    return `${monDay} - ${sunDay} ${sunMonth}`;
  } else {
    const monMonth = moment(monday).format('MMM');
    return `${monDay} ${monMonth} - ${sunDay} ${sunMonth}`;
  }
}
