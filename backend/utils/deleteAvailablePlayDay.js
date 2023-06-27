import { schedule } from "../models/db.js";

export default async function deleteAvailablePlayDay(dateToDelete) {
  let isDeleted = false;

  if (dateToDelete) {
    try {
      const deletedSuccessfully = await schedule.updateOne(
        { logsAvailablePlayDays: true },
        { $pull: { availablePlayDays: { date: dateToDelete } } }
      );

      if (deletedSuccessfully.modifiedCount > 0) {
        console.log(deletedSuccessfully)
        isDeleted = true
      }

    } catch(err) {
      console.log(`Error deleting play day from db: ${err}`);
    }
  }

  return isDeleted
}