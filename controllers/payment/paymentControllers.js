const stripeModel = require("../../models/stripeModel");
const { v4: uuidv4 } = require("uuid");
const { responseReturn } = require("../../utils/response");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function getStripeRedirectUrls(uid) {
  const websiteUrl =
    process.env.WEBSITE_URL ||
    process.env.NEXT_PUBLIC_WEBSITE_URL ||
    "http://localhost:3000";
  const base = websiteUrl.replace(/\/$/, "");
  return {
    refresh_url: `${base}/en/profile`,
    return_url: `${base}/en/profile?stripeCode=${uid}`,
  };
}

class paymentControllers {
  create_stripe_connect_account = async (req, res) => {
    const { id } = req;
    const uid = uuidv4();
    const { refresh_url, return_url } = getStripeRedirectUrls(uid);

    try {
      const stripeInfo = await stripeModel.findOne({ sellerId: id });
      if (stripeInfo) {
        await stripeModel.deleteOne({ sellerId: id });
        const account = await stripe.accounts.create({ type: "express" });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url,
          return_url,
          type: "account_onboarding",
        });
        await stripeModel.create({
          sellerId: id,
          stripeId: account.id,
          code: uid,
        });
        responseReturn(res, 201, { url: accountLink.url });
      } else {
        const account = await stripe.accounts.create({ type: "express" });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url,
          return_url,
          type: "account_onboarding",
        });

        await stripeModel.create({
          sellerId: id,
          stripeId: account.id,
          code: uid,
        });
        responseReturn(res, 201, { url: accountLink.url });
      }
    } catch (error) {
      console.log("strpe connect account errror" + error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new paymentControllers();
