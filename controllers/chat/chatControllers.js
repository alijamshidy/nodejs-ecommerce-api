const sellerModel = require("../../models/sellerModel");
const customerModel = require("../../models/customerModel");
const sellerCustomerModel = require("../../models/Chat/sellerCustomerModel");
const sellerCustomerMessage = require("../../models/Chat/sellerCustomerMessage");
const adminSellerMessage = require("../../models/Chat/adminSellerMessage");
const adminCustomerMessage = require("../../models/Chat/adminCustomerMessage");
const { responseReturn } = require("../../utils/response");

const bumpFriendToTop = (myFriends, fdId, friendEntry) => {
  const list = Array.isArray(myFriends) ? [...myFriends] : [];
  let index = list.findIndex(f => f.fdId === fdId);
  if (index === -1) {
    list.unshift(friendEntry);
    return list;
  }
  while (index > 0) {
    [list[index], list[index - 1]] = [list[index - 1], list[index]];
    index--;
  }
  return list;
};

const ensureFriendList = async (myId, fdId, friendEntry) => {
  const doc = await sellerCustomerModel.findOne({ myId });
  if (!doc) {
    await sellerCustomerModel.create({ myId, myFriends: [friendEntry] });
    return;
  }
  const myFriends = bumpFriendToTop(doc.myFriends, fdId, friendEntry);
  await sellerCustomerModel.updateOne({ myId }, { myFriends });
};

class chatControllers {
  add_customer_friend = async (req, res) => {
    const { sellerId, userId } = req.body;
    try {
      if (sellerId !== "") {
        const seller = await sellerModel.findById(sellerId);
        const user = await customerModel.findById(userId);
        const checkSeller = await sellerCustomerModel.findOne({
          $and: [
            {
              myId: {
                $eq: userId,
              },
            },
            {
              myFriends: {
                $elemMatch: {
                  fdId: sellerId,
                },
              },
            },
          ],
        });
        if (!checkSeller) {
          await sellerCustomerModel.updateOne(
            {
              myId: userId,
            },
            {
              $push: {
                myFriends: {
                  fdId: sellerId,
                  name: seller.shopInfo?.shopName,
                  image: seller.image,
                },
              },
            },
          );
        }
        const checkCustomer = await sellerCustomerModel.findOne({
          $and: [
            {
              myId: {
                $eq: sellerId,
              },
            },
            {
              myFriends: {
                $elemMatch: {
                  fdId: userId,
                },
              },
            },
          ],
        });
        if (!checkCustomer) {
          await sellerCustomerModel.updateOne(
            {
              myId: sellerId,
            },
            {
              $push: {
                myFriends: {
                  fdId: userId,
                  name: user.name,
                  image: "",
                },
              },
            },
          );
        }
        const messages = await sellerCustomerMessage.find({
          $or: [
            {
              $and: [
                {
                  receverId: {
                    $eq: sellerId,
                  },
                },
                {
                  senderId: {
                    $eq: userId,
                  },
                },
              ],
            },
            {
              $and: [
                {
                  receverId: {
                    $eq: userId,
                  },
                },
                {
                  senderId: {
                    $eq: sellerId,
                  },
                },
              ],
            },
          ],
        });
        const MyFriends = await sellerCustomerModel.findOne({
          myId: userId,
        });

        const currentFd = MyFriends?.myFriends?.find(s => s.fdId === sellerId);

        responseReturn(res, 200, {
          MyFriends: MyFriends?.myFriends ?? [],
          currentFd,
          messages,
        });
      } else {
        const MyFriends = await sellerCustomerModel.findOne({
          myId: userId,
        });
        responseReturn(res, 200, {
          MyFriends: MyFriends?.myFriends ?? [],
        });
      }
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  customer_message_add = async (req, res) => {
    const { userId, text, sellerId, name } = req.body;
    try {
      const message = await sellerCustomerMessage.create({
        senderId: userId,
        senderName: name,
        receverId: sellerId,
        message: text,
      });

      const seller = await sellerModel.findById(sellerId);

      await ensureFriendList(userId, sellerId, {
        fdId: sellerId,
        name: seller?.shopInfo?.shopName ?? "",
        image: seller?.image ?? "",
      });

      await ensureFriendList(sellerId, userId, {
        fdId: userId,
        name: name,
        image: "",
      });

      responseReturn(res, 201, { message });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  get_customers = async (req, res) => {
    const { sellerId } = req.params;
    try {
      const data = await sellerCustomerModel.findOne({
        myId: sellerId,
      });
      responseReturn(res, 200, {
        customers: data?.myFriends ?? [],
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  get_customer_seller_message = async (req, res) => {
    const { customerId } = req.params;
    const { id } = req;
    try {
      const messages = await sellerCustomerMessage.find({
        $or: [
          {
            $and: [
              {
                receverId: {
                  $eq: customerId,
                },
              },
              {
                senderId: {
                  $eq: id,
                },
              },
            ],
          },
          {
            $and: [
              {
                receverId: {
                  $eq: id,
                },
              },
              {
                senderId: {
                  $eq: customerId,
                },
              },
            ],
          },
        ],
      });

      const currentCustomer = await customerModel.findById(customerId);
      responseReturn(res, 200, {
        messages,
        currentCustomer,
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  seller_message_add = async (req, res) => {
    const { senderId, receverId, text, name } = req.body;
    try {
      const message = await sellerCustomerMessage.create({
        senderId: senderId,
        senderName: name,
        receverId: receverId,
        message: text,
      });

      const sellerDoc = await sellerCustomerModel.findOne({
        myId: senderId,
      });
      if (!sellerDoc) {
        return responseReturn(res, 404, {
          error: "Seller chat contacts not found",
        });
      }

      const customer = await customerModel.findById(receverId);
      const seller = await sellerModel.findById(senderId);

      const myFriends = bumpFriendToTop(sellerDoc.myFriends, receverId, {
        fdId: receverId,
        name: customer?.name ?? "",
        image: "",
      });
      await sellerCustomerModel.updateOne(
        { myId: senderId },
        { myFriends },
      );

      await ensureFriendList(receverId, senderId, {
        fdId: senderId,
        name: seller?.shopInfo?.shopName ?? name,
        image: seller?.image ?? "",
      });

      responseReturn(res, 201, { message });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  get_sellers = async (req, res) => {
    try {
      const sellers = await sellerModel.find({});
      responseReturn(res, 200, {
        sellers,
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  get_customers_admin = async (req, res) => {
    try {
      const customers = await customerModel.find({});
      responseReturn(res, 200, {
        customers,
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  seller_admin_message_insert = async (req, res) => {
    const { senderId, receverId, message, senderName } = req.body;

    try {
      const messageData = await adminSellerMessage.create({
        senderId,
        receverId,
        message,
        senderName,
      });
      responseReturn(res, 200, { message: messageData });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  admin_customer_message_insert = async (req, res) => {
    const { senderId, receverId, message, senderName } = req.body;

    try {
      const messageData = await adminCustomerMessage.create({
        senderId,
        receverId,
        message,
        senderName,
      });
      responseReturn(res, 200, { message: messageData });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  get_admin_customer_message = async (req, res) => {
    const { receverId } = req.params;
    const id = "";
    try {
      const messages = await adminCustomerMessage.find({
        $or: [
          {
            $and: [
              { receverId: { $eq: receverId } },
              { senderId: { $eq: id } },
            ],
          },
          {
            $and: [
              { receverId: { $eq: id } },
              { senderId: { $eq: receverId } },
            ],
          },
        ],
      });

      let currentCustomer = {};
      if (receverId) {
        currentCustomer = await customerModel.findById(receverId);
      }
      responseReturn(res, 200, {
        messages,
        currentCustomer,
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  get_customer_admin_message = async (req, res) => {
    const receverId = "";
    const { id } = req;
    try {
      const messages = await adminCustomerMessage.find({
        $or: [
          {
            $and: [
              { receverId: { $eq: receverId } },
              { senderId: { $eq: id } },
            ],
          },
          {
            $and: [
              { receverId: { $eq: id } },
              { senderId: { $eq: receverId } },
            ],
          },
        ],
      });
      responseReturn(res, 200, {
        messages,
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  get_admin_message = async (req, res) => {
    const { receverId } = req.params;
    const id = "";
    try {
      const messages = await adminSellerMessage.find({
        $or: [
          {
            $and: [
              {
                receverId: {
                  $eq: receverId,
                },
              },
              {
                senderId: {
                  $eq: id,
                },
              },
            ],
          },
          {
            $and: [
              {
                receverId: {
                  $eq: id,
                },
              },
              {
                senderId: {
                  $eq: receverId,
                },
              },
            ],
          },
        ],
      });

      let currentSeller = {};
      if (receverId) {
        currentSeller = await sellerModel.findById(receverId);
      }
      responseReturn(res, 200, {
        messages,
        currentSeller,
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  get_seller_messages = async (req, res) => {
    const receverId = "";
    const { id } = req;
    try {
      const messages = await adminSellerMessage.find({
        $or: [
          {
            $and: [
              {
                receverId: {
                  $eq: receverId,
                },
              },
              {
                senderId: {
                  $eq: id,
                },
              },
            ],
          },
          {
            $and: [
              {
                receverId: {
                  $eq: id,
                },
              },
              {
                senderId: {
                  $eq: receverId,
                },
              },
            ],
          },
        ],
      });
      responseReturn(res, 200, {
        messages,
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new chatControllers();
