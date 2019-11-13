import { logInitiate, logSuccess, logError } from '../utils/logger';
import moment from 'moment';
import getUserDataByEmail from './getUserDataByEmail';
import getUserFundsAvailable from './getUserFundsAvailable';
import getUserTransferHistory from './getUserTransferHistory';

async function sendFundsToUser({ userEmail, recipientEmail, userInstitution, amount, redisClient }) {
  const action = `sending funds ($${amount}) to user ${recipientEmail} from user ${userEmail}`;
  logInitiate(action);
  try {
    // create recipient if not existent (for demo)
    await getUserDataByEmail({ userEmail: recipientEmail, redisClient });

    // update userEmail (sender) 'fundsAvailable' value
    const senderAvailableFunds = await getUserFundsAvailable({ userEmail, redisClient });
    const sumFundsSender = Number(senderAvailableFunds) - Number(amount);
    await redisClient.setObjectKeyToRedis(
      userEmail,
      'fundsAvailable',
      String(sumFundsSender),
    );

    // update recipientEmail 'fundsAvailable' value
    const userAvailableFunds = await getUserFundsAvailable({ userEmail: recipientEmail, redisClient });
    const sumFundsRecipient = Number(userAvailableFunds) + Number(amount);
    await redisClient.setObjectKeyToRedis(
      recipientEmail,
      'fundsAvailable',
      String(sumFundsRecipient),
    );

    // update user (sender) funds sent transaction history
    const senderTransferHistory = await getUserTransferHistory({ userEmail, redisClient });
    const { fundsSent } = senderTransferHistory;
    const fundsSentArr = JSON.parse(fundsSent);
    const timeNow = moment().format();
    const fundsSentObj = {
      senderEmail: userEmail,
      recipientEmail: recipientEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution,
      type: 'SEND',
    };
    fundsSentArr.unshift(fundsSentObj);
    const fundsSentArrStr = JSON.stringify(fundsSentArr);
    await redisClient.setObjectKeyToRedis(
      userEmail,
      'fundsSent',
      fundsSentArrStr,
    );

    // update recipient funds received transaction history
    const recipientTransferHistory = await getUserTransferHistory({ userEmail: recipientEmail, redisClient });
    const { fundsReceived } = recipientTransferHistory;
    const fundsReceivedArr = JSON.parse(fundsReceived);
    const fundsReceivedObj = {
      senderEmail: userEmail,
      recipientEmail: recipientEmail,
      time: timeNow,
      amount: amount,
      institution: userInstitution,
      type: 'RECEIVE',
    };
    fundsReceivedArr.unshift(fundsReceivedObj);
    const fundsReceivedArrStr = JSON.stringify(fundsReceivedArr);
    await redisClient.setObjectKeyToRedis(
      recipientEmail,
      'fundsReceived',
      fundsReceivedArrStr,
    );

    logSuccess(action);
  }
  catch(err) {
    logError(action, err);
  }
}

export default sendFundsToUser;
