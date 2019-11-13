import { logInitiate, logSuccess, logError } from '../utils/logger';
import moment from 'moment';
import getUserFundsAvailable from './getUserFundsAvailable';
import getUserTransferHistory from './getUserTransferHistory';

async function unloadFundsOfUser({ userEmail, userInstitution, amount, redisClient }) {
  const action = `unloading funds ($${amount}) of user: ${userEmail}`;
  logInitiate(action);
  try {
    // update user 'fundsAvailable' value
    const userAvailableFunds = await getUserFundsAvailable({ userEmail, redisClient });
    const sumFunds = Number(userAvailableFunds) - Number(amount);
    await redisClient.setObjectKeyToRedis(
      userEmail,
      'fundsAvailable',
      String(sumFunds),
    );

    // update user fund uploads transaction history
    const userTransferHistory = await getUserTransferHistory({ userEmail, redisClient });
    const { fundsUnloaded } = userTransferHistory;
    const fundsUnloadedArr = JSON.parse(fundsUnloaded);
    const timeNow = moment().format();
    const fundsUnloadedObj = {
      senderEmail: userEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution,
      type: 'UNLOAD',
    };
    fundsUnloadedArr.push(fundsUnloadedObj);
    const fundsUnloadedArrStr = JSON.stringify(fundsUnloadedArr);
    await redisClient.setObjectKeyToRedis(
      userEmail,
      'fundsUnloaded',
      fundsUnloadedArrStr,
    );

    logSuccess(action);
  }
  catch(err) {
    logError(action, err);
  }
}

export default unloadFundsOfUser;
