import RedisClient from '../redis/controller';
import { logInitiate, logSuccess, logError } from '../utils/logger';
import getUserTransferHistory from './getUserTransferHistory';
import getUserFundsAvailable from './getUserFundsAvailable';

const blankUserFields = {
  fundsAvailable: 0,
  fundsUploaded: [],
  fundsSent: [],
  fundsReceived: [],
};

const blankUserFieldsStr = JSON.stringify(blankUserFields);

async function getUserDataByEmail(userEmail) {
  const action = `getting data of user: ${userEmail}`;
  logInitiate(action);
  try {
    const redisClient = new RedisClient();
    // check if user (key) exists
    const isUser = await redisClient.checkRedisKey(userEmail);

    let userData = {};
    if (isUser) {
      // if user, return user data
      const userFundsAvailable = await getUserFundsAvailable(userEmail);
      const userTransferHistory = await getUserTransferHistory(userEmail);
      const { fundsUploaded, fundsSent, fundsReceived } = userTransferHistory;
      userData = {
        fundsAvailable: userFundsAvailable,
        fundsUploaded: fundsUploaded,
        fundsSent: fundsSent,
        fundsReceived: fundsReceived,
      }
    } else {
      // if no user, set user (key) with blank fields
      // NOTE: redis is only capable of storing simple string pairs
      await redisClient.storeObjectToRedis(userEmail, {
        'fundsAvailable': '0',
        'fundsUploaded': '[]',
        'fundsSent': '[]',
        'fundsReceived': '[]',
      });
      userData = blankUserFields;
    }

    return userData;
  }
  catch(err) {
    logError(action, err);
    return {
      error: err,
    };
  }
}

export default getUserDataByEmail;
