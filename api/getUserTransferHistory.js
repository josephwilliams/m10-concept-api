import RedisClient from '../redis/controller';
import { logInitiate, logSuccess, logError } from '../utils/logger';

async function getUserTransferHistory({ userEmail, redisClient }) {
  const action = `getting fund transfer history of user ${userEmail}`;
  logInitiate(action);
  try {
    const redisClient = redisClient || new RedisClient();
    const userData = await redisClient.fetchObjectByKeyFromRedis(userEmail);
    // TODO: refactor this such that each transfer is a separate key to keep json response shorter
    logSuccess(action);
    return userData;
  }
  catch(err) {
    logError(action, err);
  }
}

export default getUserTransferHistory;
