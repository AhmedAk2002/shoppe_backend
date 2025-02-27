import {checkAuth} from "../middleware/Auth-check.js"
import express from "express"

import { signup , login, getimage ,
    generateOtpController ,
    editprofile ,
    recoverpassword ,
    getUsers ,
    dailyReport ,
    getCustomerFeedback,
    getmarketdetails,Trip,
    createDriver,getres,getUserByToken,loginPage,getdata,getTabledata,deletetable,updateTable,transactions,getTransactions,delTransactions,summaryTransactions
} from "../controllers/user-controller.js"




const router = express.Router();

router.route('/api/get_user_by_token').get(getUserByToken);

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

// router.use(checkAuth);

router.route('/login').post(login)


router.route('/api/login').get(loginPage);

// transactions

router.route("/transactions").post(transactions)
router.route("/transactions/:userId").get(getTransactions)
router.route("/transactions/:id").delete(delTransactions)
router.route("/transactions/summary/:userId").get(summaryTransactions)

// webTable
router.route('/api/tableData').post(getdata);
router.route('/getTabledata').get(getTabledata);
router.route('/deleteTable').delete(deletetable);
router.route('/updateTable').patch(updateTable);




export default router

