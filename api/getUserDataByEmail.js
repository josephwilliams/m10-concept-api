import { logInitiate, logSuccess, logError } from '../utils/logger';
import getUserTransferHistory from './getUserTransferHistory';
import getUserFundsAvailable from './getUserFundsAvailable';

function getBlankUserFieldsStr(email) {
  const blankUserFields = {
    email: email,
    fundsAvailable: 0,
    fundsLoaded: [],
    fundsSent: [],
    fundsReceived: [],
    fundsUnloaded: [],
  };

  return JSON.stringify(blankUserFields);
}

async function getUserDataByEmail({ userEmail, redisClient }) {
  const action = `getting data of user: ${userEmail}`;
  logInitiate(action);
  try {
    if (!userEmail) {
      throw new Error('no userEmail provided.');
      return {};
    }

    // check if user (key) exists
    const isUser = await redisClient.checkRedisKey(userEmail);

    let userData = {};
    if (isUser) {
      // if user, return user data
      const userTransferHistory = await getUserTransferHistory({ userEmail, redisClient });
      const {
        fundsAvailable,
        fundsLoaded,
        fundsSent,
        fundsReceived,
        fundsUnloaded,
      } = userTransferHistory;
      userData = {
        email: userEmail,
        fundsAvailable: fundsAvailable,
        fundsLoaded: fundsLoaded,
        fundsSent: fundsSent,
        fundsReceived: fundsReceived,
        fundsUnloaded: fundsUnloaded,
      }
    } else {
      // if no user, set user (key) with blank fields
      // NOTE: redis is only capable of storing simple string pairs
      await redisClient.storeObjectToRedis(userEmail, {
        'email': userEmail,
        'fundsAvailable': '0',
        'fundsLoaded': '[]',
        'fundsSent': '[]',
        'fundsReceived': '[]',
        'fundsUnloaded': '[]',
      });

      userData = getBlankUserFieldsStr(userEmail);
    }

    logSuccess(action);
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
