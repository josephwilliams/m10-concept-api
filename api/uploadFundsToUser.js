import RedisClient from '../redis/controller';
import { logInitiate, logSuccess, logError } from '../utils/logger'

async function uploadFundsToUser({ userEmail, amount }) {
  const action = `uploading funds ($${amount}) to user: ${userEmail}`;
  logInitiate(action);
  try {
    const userAvailableFunds = getUserFundsAvailable(userEmail);
    const sumFunds = Number(userAvailableFunds) + Number(amount);
    const redisClient = new RedisClient();
    const userDataJSON = await redisClient.setObjectKeyToRedis(
      userEmail,
      fundsAvailable,
      String(sumFunds),
    );
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
