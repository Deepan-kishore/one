const { default: mongoose } = require("mongoose");
const { couponSchema } = require("./schema");

const coupon = mongoose.model('coupon', couponSchema);

exports.coupon = coupon;