const { onMessagePublished } = require('firebase-functions/v2/pubsub');
const { getBasicTemplate } = require('@likecoin/edm');

const { db } = require('../modules/firebase');
const { sendEmail } = require('../modules/sendgrid');

module.exports = onMessagePublished(
  'projects/civic-liker/topics/wnft',
  async event => {
    const { message } = event.data;
    try {
      const data = JSON.parse(message.data.toString());
      const { type } = data;
      switch (type) {
        case 'mint': {
          const {
            classId,
            // iscnId,
            // txHash,
            // nftCount,
            sellerWallet,
            // uri,
          } = data;
          const emailRef = db.collection(
            process.env.FIRESTORE_NFT_MINT_SUBSCRIPTION_ROOT
          );
          const query = await emailRef
            .where('subscribedWallet', '==', sellerWallet)
            .get();
          for (let i = 0; i < query.docs.length; i += 1) {
            const doc = query.docs[i];
            const { subscriberEmail } = doc.data();
            // eslint-disable-next-line no-await-in-loop
            await sendEmail({
              email: subscriberEmail,
              subject: `Writing NFT - New NFT by ${sellerWallet}`,
              html: getBasicTemplate({
                title: `New NFT Created by ${sellerWallet}`,
                subtitle: `${classId} is now live`,
                content: `Go to https://liker.land/nft/class/${classId}`,
              }),
            });
          }
          break;
        }
        default:
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  }
);