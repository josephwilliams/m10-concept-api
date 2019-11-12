import RedisClient from '../redis/controller';
import { logInitiate, logSuccess, logError } from '../utils/logger';

async function getUserFundsAvailable({ userEmail, redisClient }) {
  const action = `getting funds available of user ${userEmail}`;
  logInitiate(action);
  try {
    const redisClient = redisClient || new RedisClient();
    const userData = await redisClient.fetchObjectByKeyFromRedis(userEmail);
    logSuccess(action);
    return (userData || {}).fundsAvailable;
  }
  catch(err) {
    logError(action, err);
  }
}

export default getUserFundsAvailable;
