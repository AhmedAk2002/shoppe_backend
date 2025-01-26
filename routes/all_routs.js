
import { check } from "express-validator"

import { signup , login, getimage ,
    generateOtpController ,
     editprofile , recoverpassword ,
     getUsers , dailyReport ,
      getCustomerFeedback ,
       getmarketdetails , Trip, createDriver, getres} from "../controllers/user-controller.js"


export default (router) =>{
    
router.route('/api/:phonenumber').get(getres);

router.route('/').get(getUsers);

router.route('/signup').post(signup);

router.route('/image').get(getimage);


router.route('/api/otp').post(generateOtpController);

router.route('/api/editprofile').patch(editprofile);

// router.use(Authcheck);

router.route('/login').post(login);


router.route('/api/updateuser').patch(recoverpassword);

router.route('/api/driver').post(createDriver);

router.route('/api/dailyreport').post(dailyReport);

router.route('/api/customerFeedback').post(getCustomerFeedback);

router.route('/api/getmarketdetails').post(getmarketdetails);

router.route('/api/trip').post(Trip);

};


