import RedisClient from '../redis/controller';
import { logInitiate, logSuccess, logError } from '../utils/logger';

async function getUserTransferHistory(userEmail) {
  const action = `getting fund transfer history of user ${userEmail}`;
  logInitiate(action);
  try {
    const redisClient = new RedisClient();
    const userDataJSON = await redisClient.fetchObjectByKeyFromRedis(userEmail);
    const userData = JSON.parse(userDataJSON);
    console.log('> userData', userData);
  }
  catch(err) {
    logError(action, err);
  }
}

export default getUserTransferHistory;
