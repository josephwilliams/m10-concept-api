import RedisClient from '../redis/controller';
import { logInitiate, logSuccess, logError } from '../utils/logger'

async function uploadFundsToUser({ userEmail, amount }) {
  const action = `uploading funds ($${amount}) to user: ${userEmail}`;
  logInitiate(action);
  try {
    // const userData = await redisClient.fetchObjectByKeyFromRedis(userEmail);
    // return JSON.parse(userData);
  }
  catch(err) {
    logError(action, err);
    const errMessage = lodashGet(err, 'response.data.message');
    return {
      error: errMessage,
    };
  }
}

export default uploadFundsToUser;
