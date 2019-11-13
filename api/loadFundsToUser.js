import { logInitiate, logSuccess, logError } from '../utils/logger';
import moment from 'moment';
import getUserFundsAvailable from './getUserFundsAvailable';
import getUserTransferHistory from './getUserTransferHistory';

async function loadFundsToUser({ userEmail, userInstitution, amount, redisClient }) {
  const action = `uploading funds ($${amount}) to user: ${userEmail}`;
  logInitiate(action);
  try {
    // update user 'fundsAvailable' value
    const userAvailableFunds = await getUserFundsAvailable({ userEmail, redisClient });
    const sumFunds = Number(userAvailableFunds) + Number(amount);
    await redisClient.setObjectKeyToRedis(
      userEmail,
      'fundsAvailable',
      String(sumFunds),
    );

    // update user fund uploads transaction history
    const userTransferHistory = await getUserTransferHistory({ userEmail, redisClient });
    const { fundsLoaded } = userTransferHistory;
    const fundsLoadedArr = JSON.parse(fundsLoaded);
    const timeNow = moment().format();
    const fundsLoadedObj = {
      senderEmail: userEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution,
      type: 'LOAD',
    };
    fundsLoadedArr.unshift(fundsLoadedObj);
    const fundsLoadedArrStr = JSON.stringify(fundsLoadedArr);
    await redisClient.setObjectKeyToRedis(
      userEmail,
      'fundsLoaded',
      fundsLoadedArrStr,
    );

    logSuccess(action);
  }
  catch(err) {
    logError(action, err);
  }
}

export default loadFundsToUser;
