import RedisClient from '../redis/controller';
import { logInitiate, logSuccess, logError } from '../utils/logger';
import moment from 'moment';
import getUserFundsAvailable from './getUserFundsAvailable';
import getUserTransferHistory from './getUserTransferHistory';

async function uploadFundsToUser({ userEmail, userInstitution, amount }) {
  const action = `uploading funds ($${amount}) to user: ${userEmail}`;
  logInitiate(action);
  try {
    // update user 'fundsAvailable' value
    const userAvailableFunds = await getUserFundsAvailable(userEmail);
    const sumFunds = Number(userAvailableFunds) + Number(amount);
    const redisClient = new RedisClient();
    await redisClient.setObjectKeyToRedis(
      userEmail,
      'fundsAvailable',
      String(sumFunds),
    );

    // update user fund uploads transaction history
    const userTransferHistory = await getUserTransferHistory({ userEmail, redisClient });
    const { fundsUploaded } = userTransferHistory;
    const fundsUploadedArr = JSON.parse(fundsUploaded);
    const timeNow = moment().format();
    const fundsUploadedObj = {
      senderEmail: userEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution,
    };
    fundsUploadedArr.push(fundsUploadedObj);
    const fundsUploadedArrStr = JSON.stringify(fundsUploadedArr);
    await redisClient.setObjectKeyToRedis(
      userEmail,
      'fundsUploaded',
      fundsUploadedArrStr,
    );

    logSuccess(action);
  }
  catch(err) {
    logError(action, err);
  }
}

export default uploadFundsToUser;
