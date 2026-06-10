const cardControllers = require('../../controllers/home/cardControllers') 
const router = require('express').Router()

router.post('/home/product/add-to-card',cardControllers.add_to_card)
router.get('/home/product/get-card-products/:userId',cardControllers.get_card_products)
router.delete('/home/product/delete-card-product/:card_id',cardControllers.delete_card_products)
router.put('/home/product/quantity-inc/:card_id',cardControllers.quantity_inc)
router.put('/home/product/quantity-dec/:card_id',cardControllers.quantity_dec)
router.post('/home/product/add-to-wishlist',cardControllers.add_wishlist)
router.get('/home/product/get-wishlist-products/:userId',cardControllers.get_wishlist)
router.delete('/home/product/remove-wishlist-product/:wishlistId',cardControllers.remove_wishlist)

module.exports = router 