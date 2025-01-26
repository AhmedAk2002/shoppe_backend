import { validationResult, body } from "express-validator"
import bcrypt from "bcryptjs";
import {HttpError} from "../models/Httperror.js"
import {User} from "../models/user.js"
import {jwt} from "jsonwebtoken"
import {driverSchema} from "../models/Driver.js"
import {feedbacks} from "../models/customerFeedback.js"
import{generateOtp} from "../middleware/OTP.js"
import {trip} from "../models/trip.js"
import {path} from 'path'



export const getimage = async (req, res, next) => {
    // Use path.join for a consistent absolute path
    const imagePath = path.join('C:/Users/E-AhmedMoha-M-APP/downloads', 'prime.jpg');

    // Use res.sendFile with an absolute path
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Error sending image file");
        }
    });
};

// Fetch user by phone number
export const getUsers = async (req, res, next) => {
    const phonenumber = req.params.phonenumber;

    if (!phonenumber) {
        return next(new HttpError("Phone number is required", 400));
    }

    try {
        // Fetch the user by phone number, selecting only the necessary fields

        const user = await User.findOne({ phonenumber: phonenumber }).select('_id name email phonenumber money  transections  inactive  referred token');
        // console.log(user);
        
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        res.status(200).json({ 
            message: "User fetched successfully", 
            user,
            
                });
    } catch (error) {
        console.error('Error fetching user:', error);
        return next(new HttpError("Server error", 500));
    }
};


// Sign up a new user
export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(errors.array()); // Log validation errors
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

    const { name, phonenumber, email, password, money ,referred , transections , inactive } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Signup failed, please try again later", 500);
        console.error("Error checking existing user:", err);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError("User already exists, log in instead", 422);
        return next(error);
    }

    // Validate phone number length
    if (phonenumber.length !== 9) {
        const error = new HttpError("Phone number is not valid", 422);
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError("Could not create user, try again later", 500);
        console.error("Error during password hashing:", err);
        return next(error);
    }
 
    // Default money
    const Money = money || 1400;
    const ref = referred || 2;
    const Transaction = transections || 2;
    const Active = inactive || 2;


    const createdUser = new User({
        name,
        phonenumber,
        email,
        password: hashedPassword,
        money: Money,
        transections : Transaction,
        inactive : Active,
        referred : ref,
    
        

    });

    try {
        await createdUser.save();
    } catch (err) {
        console.error("Error saving user to database:", err.message, err);
        return next(new HttpError("Signup failed, try again later", 500));
    }

    let token;
    try {
        const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, jwtSecret, { expiresIn: '3h' });
        createdUser.token = token; // Assign token to user object
        await createdUser.save(); // Save the updated user
        // console.log("Generated Token:", token);

    } catch (err) {
        console.error("Error generating token:", err);
        return next(new HttpError("Signing up/token failed, try again later", 500));
    }

    res.status(201).json({
        name: createdUser.name,
        userId: createdUser.id,
        phonenumber: createdUser.phonenumber,
        email: createdUser.email,
        token: createdUser.token,
        money: createdUser.Money,
        transections : createdUser.transections,
        inactive : createdUser.inactive,
        referred : createdUser.referred
        
    });
};


// Log in a user
export const login = async (req, res, next) => {
    const { email, phonenumber, password } = req.body;
    // console.log(req.body);

    // Log the input received from the frontend
    // console.log("Email from request:", email);
    // console.log("Phone number from request:", phonenumber);
    // console.log("Password from request:", password);

    let existingUser;
    try {
        // Fetch user by email
        existingUser = await User.findOne({ email: email });


        if (!existingUser) {
            return next(new HttpError("Invalid user, could not log you in.", 401));
        }

        // Verify phone number
        if (existingUser.phonenumber !== phonenumber) {
            return next(new HttpError("Invalid number, could not log you in.", 401));
        }

        // Compare the password
        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        // Log the password comparison result
        // console.log("Password comparison result:", isValidPassword);

        if (!isValidPassword) {
            return next(new HttpError("Invalid password, could not log you in.", 401));
        }

        let token;
        try {
            const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';
            token = jwt.sign(
                { userId: existingUser.id, email: existingUser.email },
                jwtSecret,
                { expiresIn: '3h' }
            );
            existingUser.token = token; // Assign token to the user object
            console.log("Token from request:", token);


            // Optionally save the updated user (if you need to persist the token)
            await existingUser.save();
        } catch (err) {
            console.error("Error generating token:", err);
            return next(new HttpError("Signing up/token failed, try again later", 500));
        }

        // Send success response
        res.status(200).json({
            message: "Login successful",
            user: {
                name: existingUser.name,
                id: existingUser.id,
                email: existingUser.email,
                phonenumber: existingUser.phonenumber,
                token : token,
                money : existingUser.money,
                transections : existingUser.transections,
                inactive : existingUser.inactive,
                referred : existingUser.referred
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return next(new HttpError("Logging in failed, please try again later.", 500));
    }
};


export const recoverpassword = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("No valid data passed, update error", 422));
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new HttpError("Email and password are required", 422));
    }

    if (password.length < 4) {
        return next(new HttpError("Password must be at least 4 characters long", 422));
    }

    let user;
    try {
        // Find the user by email
        user = await User.findOne({ email: email });
    } catch (err) {
        console.error("Error finding user:", err);
        return next(new HttpError("User not found or exists", 500));
    }

    if (!user) {
        return next(new HttpError("User not found", 404));
    }

    // Compare the old password with the new password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        // If the old password is the same as the new one, return an error
        return next(new HttpError("New password cannot be the same as the old password", 400));
    }

    try {
        // Hash the new password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds

        // Update the user's password to the hashed new password
        user.password = hashedPassword;

        // Save the user with the new hashed password
        await user.save();
    } catch (err) {
        console.error("Error saving user:", err);
        return next(new HttpError("Something went wrong while saving the user", 500));
    }

    res.status(200).json({ status: 'Password updated successfully', user: user.toObject({ getters: true }) });
};
export const editprofile = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        console.log("Validation Errors:", error.array());
        return next(new HttpError("Invalid input, please check your data", 422));
    }

    const { email, name } = req.body;

    if (!email || !name) {
        console.log("Missing fields:", req.body);
        return next(new HttpError("All fields are required", 422));
    }

    let user;
    try {
        user = await User.findOne({ email: email });
    } catch (err) {
        // console.error("Error finding user:", err);
        return next(new HttpError("Something went wrong, could not update the profile", 500));
    }

    if (!user) {
        // console.error("User not found:", email);
        return next(new HttpError("User not found", 404));
    }

    try {
        user.name = name;
        user.email = email;

        await user.save();
    } catch (err) {
        // console.error("Error saving user:", err);
        return next(new HttpError("Something went wrong while updating the profile", 500));
    }

    res.status(200).json({ message: "Profile updated successfully", user: user.toObject({ getters: true }) });
};


export const generateOtpController = async (req, res, next) => {
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(errors.array()); // Log validation errors
            return next(new HttpError("Invalid inputs passed, please check your data", 422));
        }
    
        const { phonenumber } = req.body;
    
        if (!phonenumber) {
            return next(new HttpError("Please fill all fields", 400));
        }

        let existingUser;
    try {
        existingUser = await User.findOne({ phonenumber: phonenumber });
    } catch (err) {
        const error = new HttpError("Signup failed, please try again later", 500);zl
        console.error("Error checking existing user:", err);

        return next(error);
    }

    if(!existingUser){
        return next(new HttpError("User does not exist", 422));
    }
    
        // const allowedPhoneNumbers = ["618373608"]; 

        // // Check if the provided phone number matches the allowed number
        // if (!allowedPhoneNumbers.includes(phonenumber)) {
        //     return next(new HttpError("Phone number not allowed", 403));
        // }

        

        // Ensure OTP is being returned in the response correctly
        // console.log(Generated OTP for ${phonenumber}: ${otp}); phone and otp
        // console.log(Generated OTP   ${generateOtp()});

        return res.status(200).json({
            success: true,
            otp: generateOtp(),
            message: "OTP sent successfully."
        });
    } catch (error) {
        console.error("Error generating OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        

        });
    }
};


export const getres = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (err) {
        console.error('Error fetching users:', err);
        return next(new HttpError('Fetching users failed, please try again later.', 500));
    }
};

// const getres = async (req, res, next) => {
//     try {
//         // Extract phoneNumber from the request query
//         const { phonenumber } = req.body;

//         // Ensure the phone number is provided
//         if (!phonenumber) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Phone number is required.'
//             });
//         }
//         const allowedPhoneNumbers = ["615880177"]; 
        
    
//         // Check if the provided phone number matches the allowed number
//         if (!allowedPhoneNumbers.includes(phonenumber)) {
//             return next(new HttpError("Phone number not allowed", 403));
//         }

//         // Find the user by phone number
//         const user = await User.findOne({ phonenumber }, 'name email phonenumber');

//         // If no user is found, return a 404 response
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found.'
//             });
//         }

//         // Return the user data
//         res.status(200).json({
//             success: true,
//             data: user
//         });
//     } catch (err) {
//         console.error('Error fetching user by phone number:', err);
//         res.status(500).json({
//             success: false,
//             message: 'Fetching user failed, please try again later.'
//         });
//     }
// };



export const createDriver = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array());
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

    const { name, phonenumber, tarigo, description, image, type } = req.body;

    if (!name || !phonenumber || !tarigo || !description || !image || !type) {
        return next(new HttpError("All fields are required", 422));
    }

    // Check if a driver with the same phone number already exists
    let existingDriver;
    try {
        existingDriver = await driverSchema.findOne({ phonenumber: phonenumber });
    } catch (err) {
        console.error("Error checking existing driver:", err);
        return next(new HttpError("Could not check for existing driver, please try again later.", 500));
    }

    if (existingDriver) {
        return next(new HttpError("Driver with this phone number already exists.", 422));
    }

    // Create the new driver
    const createdDriver = new Driver({
        name,
        phonenumber,
        tarigo,
        description,
        image,
        type,
    });

    try {
        await createdDriver.save();
        res.status(201).json({ message: "Driver created successfully", driver: createdDriver });
    } catch (err) {
        console.error("Error saving driver:", err);
        return next(new HttpError("Creating driver failed, please try again later.", 500));
    }
};


export const dailyReport = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("Validation errors:", errors.array());
            return next(new HttpError("Invalid inputs passed, please check your data", 422));
        }
    
        const { phonenumber } = req.body;
    
        if (!phonenumber) {
            return next(new HttpError("Please fill all fields", 400));
        }
    
        const allowedPhoneNumbers = ["615880177"]; 
        
    
        // Check if the provided phone number matches the allowed number
        if (!allowedPhoneNumbers.includes(phonenumber)) {
            return next(new HttpError("Phone number not allowed", 403));
        }
        res.status(200).json({
            success: true,
            AdminPhone: phonenumber,
            registerd_today: 0
        });
    
        
    } catch (error) {
        console.error("Error  :", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
    
    
        });
    }
}

export const getCustomerFeedback = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(errors.array()); // Log validation errors
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

    const { title, message, phonenumber } = req.body;
    // console.log(req.body);

    try {
        // Validate input
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'title number is required.'
            });
        }
        // if (!id) {
        //     return next(new HttpError("Marketter ID is required", 400));
        // }
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'message number is required.'
            });
        }
        if (!phonenumber) {
            return res.status(400).json({
                success: false,
                message: 'phonenumber number is required.'
            });
        }
        // Check if the provided phone number matches the allowed number
        const allowedPhoneNumbers = ["615880177"];
        // const allowedIds = ["675946e9a4cc2d66d780a672"];

        if (!allowedPhoneNumbers.includes(phonenumber)) {
            return next(new HttpError("Phone number not allowed", 403));
        }   
        // if (!allowedIds.includes(id)) {
        //     return next(new HttpError("Marketter ID not allowed", 403));
        // }
        // Create a new customer feedback
        const createdFeedback = new feedbacks({
            title,
            // id,
            message,
            phonenumber,
        });

        try {
            await createdFeedback.save();
            res.status(200).json({
                success: true,
                status: 200,
                message: "Feedback created successfully",
            
            });
                } catch (err) {
            console.error("Error saving feedback:", err);
            return next(new HttpError("Creating feedback failed, please try again later.", 500));
        }

        // Respond with success
    } catch (error) {
        console.error("Error processing customer feedback:", error);
        return next(new HttpError("Internal Server Error", 500));
    }
};
export const getmarketdetails = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

    const { id } = req.body;

    if (!id) {
        return next(new HttpError("ID is required", 400));
    }


    try {
        // Fetch market details from the database
        const marketDetails = await User.findById(id);
        const otp = Math.floor(1000 + Math.random() * 9000);


        if (!marketDetails) {
            return next(new HttpError("Market details not found", 404));
        }

        // Destructure fields from marketDetails
        const {
            name,
            phonenumber,
            picture,
            email,
            token,
        } = marketDetails;

        // Respond with market details
        res.status(200).json({
            success: true,
            data: {
                id,
                name,
                phonenumber,
                picture,
                email,
                token,
                otp_at: otp,
                attempts_number: 0,
                totall_referals: 0,
                totall_referals_credited: 0,
                is_approved: false,
                is_called: false,
                is_from_quality: false,
                favorate_provider: false,
                is_points: false,
                total_points: 0,
                KYC_called: false,
                view_otp: otp,
                rate: 0,
                rate_count: 0,
                wallet: 0,
                is_use_wallet: false,
            },
            total_trip_earned: 0.00,
        });
    } catch (err) {
        console.error('Error fetching market details:', err);
        return next(new HttpError("Fetching market details failed, please try again later.", 500));
    }
};

export const Trip = async(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

    const {phonenumber,destnation,location}= req.body
    
try{

    if(!phonenumber){
        return next(new HttpError("phone required", 403));
    };
    if(!destnation){
        return next(new HttpError("destnation required", 403));
    };
    if(!location){
        return next(new HttpError("location required", 403));
    };


    const createdTrip = new trip({
        destnation,
        location,
        phonenumber,

    });
    await createdTrip.save();
    res.status(200).json({
        success: true,
        status: 200,
        message: "trip created successfully",
    
    });
    
}catch(err){
    console.error('trip erro:', err);
    return next(new HttpError("creating trip failed.", 500));

}

}