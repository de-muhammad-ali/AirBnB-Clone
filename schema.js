const Joi = require('joi');
const User = require('./models/user');

//uniqueness 
const uniqueEmail = async (value, helper) => {
    const user = await User.findOne({email: value});

    if(user){
        helper.message("Email already exits");
    }

    return value;
}  

//Listing
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required()
    }).required()
})


//Review
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
})


//User
module.exports.userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required().custom(uniqueEmail),
        password: Joi.string().required(),
    }).required()
})

module.exports.userSchemaLogin = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
})