import { schedule } from '../models/db.js';

export default async function getAvailablePlayDays() {
  const document = await schedule.findOne({ logsAvailablePlayDays: true });
  if (document) {
    return document.availablePlayDays;
  } else return false
}
