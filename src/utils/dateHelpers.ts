// Helper functions for dates, presets, and Google Calendar export

export function getUpcomingDay(targetDayOfWeek: number): string {
  // targetDayOfWeek: 0 = Sunday, 5 = Friday, 6 = Saturday
  const now = new Date();
  const currentDay = now.getDay();
  let daysToAdd = targetDayOfWeek - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysToAdd);
  return targetDate.toISOString().split('T')[0];
}

export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatFriendlyTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes} ${period}`;
}

export function createGoogleCalendarUrl({
  title,
  date,
  time,
  activity,
  sender,
  recipient,
  notes,
}: {
  title: string;
  date: string;
  time: string;
  activity: string;
  sender: string;
  recipient: string;
  notes?: string;
}): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = (time || '19:00').split(':').map(Number);

  const start = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

  const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
  const formatUtc = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const datesParam = `${formatUtc(start)}/${formatUtc(end)}`;

  const details = [
    `💖 Date with ${recipient || 'you'} & ${sender || 'me'}!`,
    `✨ Activity: ${activity}`,
    notes ? `📝 Preferences / Notes: ${notes}` : '',
    `💌 Sealed with DateWithMe App`,
  ]
    .filter(Boolean)
    .join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || `Date with ${recipient || 'my favorite person'} 💕`,
    dates: datesParam,
    details: details,
    location: activity,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
