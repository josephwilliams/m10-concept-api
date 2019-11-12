import RedisClient from '../redis/controller';
import { logInitiate, logSuccess, logError } from '../utils/logger';

async function getUserFundsAvailable(userEmail) {
  const action = `getting funds available of user ${userEmail}`;
  logInitiate(action);
  try {
    const redisClient = new RedisClient();
    const userDataJSON = await redisClient.fetchObjectByKeyFromRedis(userEmail);
    const userData = JSON.parse(userDataJSON);
    const userFundsAvailable = userData.fundsAvailable;
    return userFundsAvailable;
  }
  catch(err) {
    logError(action, err);
  }
}

export default getUserFundsAvailable;
