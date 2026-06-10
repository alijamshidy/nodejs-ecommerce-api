const chatControllers = require('../controllers/chat/chatControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.post('/chat/customer/add-customer-friend', chatControllers.add_customer_friend)
router.post('/chat/customer/send-message-to-seller', chatControllers.customer_message_add)
router.get('/chat/seller/get-customers/:sellerId', chatControllers.get_customers)
router.get('/chat/seller/get-customer-message/:customerId',authMiddleware,chatControllers.get_customer_seller_message)
router.post('/chat/seller/send-message-to-customer',authMiddleware, chatControllers.seller_message_add)
router.get('/chat/admin/get-sellers', authMiddleware ,chatControllers.get_sellers)
router.post('/chat/message-send-seller-admin', authMiddleware ,chatControllers.seller_admin_message_insert)
router.get('/chat/get-admin-message/:receverId', authMiddleware ,chatControllers.get_admin_message)
router.get('/chat/get-seller-message', authMiddleware ,chatControllers.get_seller_messages)

module.exports = router