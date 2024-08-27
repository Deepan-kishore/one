const { default: mongoose } = require("mongoose");

const couponSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    code:{
        type: String,
        required: true,
        unique: true, // Ensure the code is unique
    },
    description:{
        type: String,
        required: false,
    },
    expiryDate:{
        type: Date,
        required: true,
        default: Date.now()
    },
    identity:{
        type: String,
    }
});

couponSchema.pre('save',function(next){
    const doc = this;
    console.log('Pre Save Hook:', doc);

    mongoose.model('coupon', couponSchema).findOne({ sort: { 'identity' : -1 } }).then((lastCoupon)=> {
       
        doc.identity = lastCoupon ? lastCoupon.id + 1 : 1;
        console.log(',lastCoupon',lastCoupon, doc.identity);
        next();
    }).catch((err) => {
        console.log('Error:', err);
        if (err) {
            return next(err);
        }
    });
})

// couponSchema.pre('save', function(next) {
    
//     const doc = this;
//     console.log('Pre Save Hook:', doc);
//    console.log(  mongoose.model('coupon', couponSchema).find({sort:{'expiryDate':'asc'}}));
  
    
    // next();

       

    // mongoose.model('coupon', couponSchema).findOne({}, {}, { sort: { '_id' : -1 } }, function(err, lastCoupon) {
    //     if (err) {
    //         return next(err);
    //     }
    //     doc._id = lastCoupon ? lastCoupon._id + 1 : 1;
    //     next();
    // });
// });


exports.couponSchema = couponSchema;