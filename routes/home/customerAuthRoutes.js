const customerAuthControllers = require('../../controllers/home/customerAuthControllers') 
const router = require('express').Router()

router.post('/customer/customer-register',customerAuthControllers.customer_register)
router.post('/customer/customer-login',customerAuthControllers.customer_login)
router.post('/customer/send-otp',customerAuthControllers.send_otp)
router.post('/customer/verify-otp',customerAuthControllers.verify_otp)
router.get('/customer/logout',customerAuthControllers.customer_logout)

module.exports = router 