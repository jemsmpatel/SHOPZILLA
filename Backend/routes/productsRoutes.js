import express from 'express';

//controllers
import {
    createProduct, createProductReview, deleteProductReview, getAllProduct, getProductReviews, toggleProductStatus, getSellerAllProducts, getSpesificProduct, updateProductReview, updateSpesificProduct, deleteProduct,
} from '../controllers/productController.js';


//middlewares
import { authenticate, sellerauthenticate } from '../middlewares/authMiddleware.js'


const router = express.Router();

router.route('/')
    .get(getAllProduct)
    .post(sellerauthenticate, createProduct);

router.route('/:id')
    .get(getSpesificProduct)
    .put(sellerauthenticate, updateSpesificProduct);

router.put("/:id/toggle", sellerauthenticate, toggleProductStatus);
router.put("/:id/delete", sellerauthenticate, deleteProduct);

router.route("/seller/products")
    .get(sellerauthenticate, getSellerAllProducts);

router.route("/review/:id")
    .post(authenticate, createProductReview)
    .put(authenticate, updateProductReview)
    .delete(authenticate, deleteProductReview);

router.get("/:id/reviews", getProductReviews);


export default router;