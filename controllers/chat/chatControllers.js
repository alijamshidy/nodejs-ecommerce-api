const sellerModel = require("../../models/sellerModel");
const customerModel = require("../../models/customerModel");
const sellerCustomerModel = require("../../models/Chat/sellerCustomerModel");
const sellerCustomerMessage = require("../../models/Chat/sellerCustomerMessage");
const adminSellerMessage = require("../../models/Chat/adminSellerMessage");
const { responseReturn } = require("../../utils/response");

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

        const currentFd = MyFriends.myFriends.find(s => s.fdId === sellerId);

        responseReturn(res, 200, {
          MyFriends: MyFriends.myFriends,
          currentFd,
          messages,
        });
      } else {
        const MyFriends = await sellerCustomerModel.findOne({
          myId: userId,
        });
        responseReturn(res, 200, {
          MyFriends: MyFriends.myFriends,
        });
      }
    } catch (error) {
      console.log(error.message);
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

      const data = await sellerCustomerModel.findOne({
        myId: userId,
      });

      if (data?.myFriends) {
        let myFriends = data.myFriends;
        let index = myFriends.findIndex(f => f.fdId === sellerId);
        while (index > 0) {
          let temp = myFriends[index];
          myFriends[index] = myFriends[index - 1];
          myFriends[index - 1] = temp;
          index--;
        }
        await sellerCustomerModel.updateOne(
          {
            myId: userId,
          },
          {
            myFriends,
          },
        );
      }

      const data1 = await sellerCustomerModel.findOne({
        myId: sellerId,
      });

      if (data1?.myFriends) {
        let myFriends1 = data1.myFriends;
        let index1 = myFriends1.findIndex(f => f.fdId === userId);
        while (index1 > 0) {
          let temp1 = myFriends1[index1];
          myFriends1[index1] = myFriends1[index1 - 1];
          myFriends1[index1 - 1] = temp1;
          index1--;
        }
        await sellerCustomerModel.updateOne(
          {
            myId: sellerId,
          },
          {
            myFriends: myFriends1,
          },
        );
      }

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
        customers: data.myFriends,
      });
    } catch (error) {
      console.log(error.message);
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

      const data = await sellerCustomerModel.findOne({
        myId: senderId,
      });
      if (!data?.myFriends) {
        return responseReturn(res, 404, {
          error: "Seller chat contacts not found",
        });
      }

      let myFriends = data.myFriends;
      let index = myFriends.findIndex(f => f.fdId === receverId);
      while (index > 0) {
        let temp = myFriends[index];
        myFriends[index] = myFriends[index - 1];
        myFriends[index - 1] = temp;
        index--;
      }
      await sellerCustomerModel.updateOne(
        {
          myId: senderId,
        },
        {
          myFriends,
        },
      );

      let data1 = await sellerCustomerModel.findOne({
        myId: receverId,
      });
      if (!data1?.myFriends) {
        const seller = await sellerModel.findById(senderId);
        data1 = await sellerCustomerModel.create({
          myId: receverId,
          myFriends: [
            {
              fdId: senderId,
              name: seller?.shopInfo?.shopName ?? name,
              image: seller?.image ?? "",
            },
          ],
        });
      }

      let myFriends1 = data1.myFriends;
      let index1 = myFriends1.findIndex(f => f.fdId === senderId);
      while (index1 > 0) {
        let temp1 = myFriends1[index1];
        myFriends1[index1] = myFriends1[index1 - 1];
        myFriends1[index1 - 1] = temp1;
        index1--;
      }
      await sellerCustomerModel.updateOne(
        {
          myId: receverId,
        },
        {
          myFriends: myFriends1,
        },
      );

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
    }
  };
}

module.exports = new chatControllers();
