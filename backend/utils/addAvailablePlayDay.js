import { schedule } from "../models/db.js";

export default async function addAvailablePlayDay(dateToAdd, labelToAdd) {
  let isAdded = false;

  if (dateToAdd) {
    try {
      const addedSuccessfully = await schedule.updateOne(
        { logsAvailablePlayDays: true },
        { $push: { availablePlayDays: { date: dateToAdd, label: labelToAdd } } }
      );

      if (addedSuccessfully.modifiedCount > 0) {
        console.log(addedSuccessfully)
        isAdded = true
      }

    } catch(err) {
      console.log(`Error adding play day to db: ${err}`);
    }
  }

  return isAdded
}