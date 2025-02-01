
import check  from "express-validator"
import express from "express";
import Authcheck from "../middleware/Auth-check.js"


import { signup , login, getimage ,
    generateOtpController ,
    editprofile ,
    recoverpassword ,
    getUsers ,
    dailyReport ,
    getCustomerFeedback ,
    getmarketdetails,Trip,
    createDriver,getres,getUserByToken
} from "../controllers/user-controller.js"



const router = express.Router();

router.route('/api/token').get(getUserByToken);

router.route('/api/:phonenumber').get(getUsers);

router.route('/').get(getres);

router.route('/signup').post(signup);


router.route('/image').get(getimage);

router.route('/api/otp').post(generateOtpController);

router.route('/api/editprofile').patch(editprofile);

router.route('/api/updateuser').patch(recoverpassword);

router.route('/api/driver').post(createDriver);

router.route('/api/dailyreport').post(dailyReport);

router.route('/api/customerFeedback').post(getCustomerFeedback);

router.route('/api/getmarketdetails').post(getmarketdetails);

router.route('/api/trip').post(Trip);

router.use(Authcheck);

router.route('/login').post(login)

export default router