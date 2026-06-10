const homeControllers = require('../../controllers/home/homeControllers') 
const router = require('express').Router()

router.get('/get-category',homeControllers.get_category)
router.get('/get-product',homeControllers.get_product)
router.get('/price-range-latest-product',homeControllers.price_range_product)
router.get('/query-products',homeControllers.query_products)
router.get('/product-details/:slug',homeControllers.product_details)
router.post('/customer/submit-review',homeControllers.submit_review)
router.get('/customer/get-review/:productId',homeControllers.get_review)

module.exports = router 