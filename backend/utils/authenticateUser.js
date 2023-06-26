import basicAuth from 'express-basic-auth';
import { schedule } from '../models/db.js';

export default function authenticateUser() {
  return async (req, res, next) => {
    try {
      const admin = await schedule.findOne({ adminCredentials: { '$exists': true } });

      if (!admin || !admin.adminCredentials) {
        return res.status(401).send('Unauthorized');
      }

      const { user, password } = admin.adminCredentials;

      return basicAuth({
        users: { [user]: password },
        challenge: true,
      })(req, res, next);

    } catch (error) {
      next(error);
    }
  };
}
