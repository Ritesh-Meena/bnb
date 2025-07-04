const express=require("express");
const router=express.Router({mergeParams:true});
const ExpressError=require("../utils/ExpressError.js")
const wrapAsync=require("../utils/wrapAsync.js")
const Listing=require("../models/listing.js")
const Review=require('../models/review.js');
const {reviewSchema}=require("../schema.js")
const {validateReview, isLoggedIn,isReviewAuthor

}=require("../middleware.js")
 
const reviewController=require("../controllers/reviews.js")
const review=require("../models/review.js"

)
//reviews
router.post("/",validateReview
  ,validateReview,wrapAsync(
    reviewController.createReview))
   

//Delete Route
router.delete(
    "/:reviewId",isLoggedIn,isReviewAuthor,
    
    
    wrapAsync(
        reviewController.destroyReview
     )
)


module.exports=router