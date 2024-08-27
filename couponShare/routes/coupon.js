const express = require('express');
const { coupon } = require('../model/coupon');
const app = express();

const couponRouter = express.Router();

couponRouter.use(express.json());

// CREATE
couponRouter.post('/create', async (req, res) => {
    
    const {
        name,
        code,
        description,
        expiryDate,
    } = req.body;
    
   try {
    const response =  await coupon.create({
        name,
        code,
        description,
        expiryDate,
    })
    
        res.json({message:'Coupon created', data:response});
   } catch (error) {
    console.log(error);
    
    res.json({message:'Coupon creation failed', error:error});
    
   }
    });


// READ
couponRouter.get('/getAll', async(req, res) => {
   try {
    const response = await coupon.find();
    res.json({message:'All Coupons', data:response});
   } catch (error) {
    res.status(500).json({message:'Internal Server Error'});
   }
});

couponRouter.post('/getByQuery', async(req, res) => {
    const query = req.body
    try {
     const response = await coupon.find(query || {});
     res.json({message:'All Coupons', data:response});
    } catch (error) {
     res.status(500).json({message:'Internal Server Error'});
    }
 });


// UPDATE
// DELETE
couponRouter.delete('/delete/all',async(_req,res)=>{
try {
    const response = await coupon.deleteMany();
    res.json({message:'All Coupons Deleted', data:response});
} catch (error) {
    console.log('Error:', error);
    res.json({message:'Failed to delete all coupons', error:error});    
}
})

exports.couponRouter = couponRouter;
