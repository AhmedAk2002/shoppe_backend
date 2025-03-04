import {validationResult} from "express-validator"
import bcrypt from "bcryptjs";
import {HttpError} from "../models/Httperror.js"
import jwt from "jsonwebtoken"
import { generateOtp } from "../middleware/OTP.js"
import path from 'path'
import User from "../models/user.js"
import feedbacks from "../models/customerFeedback.js"
import driver from "../models/Driver.js"
import trip from "../models/trip.js"
import ErrorHandler from "../middleware/errorHandler.js"
import user from "../models/user.js";
import tabledata from "../models/tabledata.js";
import { Transaction } from "../models/transactions.js";





const otp = generateOtp();


export const getimage = async (req, res, next) => {
    // Use path.join for a consistent absolute path
    const imagePath = path.join('C:/Users/E-AhmedMoha-M-APP/downloads', 'prime.png');

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
        res.json({
            success:true,
            ErrorHandler:ERROR_CODE.USER_PHONE_NUMBER_REQUIRE

        })
        
    }

    try {
        // Fetch the user by phone number, selecting only the necessary fields

        const user = await User.findOne({ phonenumber: phonenumber }).
        select('_id name email phonenumber money  transections  inactive  referred token');
        // console.log(user);
        
        if (!user) {
              return res.status(401).json({
                success: false,
                ErrorHandler: ErrorHandler.WRONG_USER
                
            })
        
        }

        res.status(200).json({
            message: "all Users",
            user: {
                name: user.name,
                id: user._id,
                email: user.email,
                phonenumber: user.phonenumber,
                token : user.token,
                money : user.money,
                transections :  user.transections,
                inactive : user.inactive,
                referred : user.referred
            },
            
                });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.FETCHING_USER_FAILED
            
        })
    
    }
};


// Sign up a new user
// for android
// export const signup = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return next(new HttpError("No valid data passed, update error", 422));
//     }
   

//     const { name, phonenumber, email, password, money ,referred , transections , inactive } = req.body;

//     let existUser;
//     try {
//         existUser = await User.findOne({ email: email });
//     } catch (err) {
//         console.error("Error checking existing user:", err);
//         return res.json({
//             success: false,
//             ErrorHandler: ErrorHandler.SIGNUP_FAILED
        
//         });
//     }
    
        
//     if (existUser) {
//         return res.json({
//             success: false,
//             ErrorHandler: ErrorHandler.USER_EXIST
            
//         });
//     };

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         const error = new HttpError("Email is not valid", 422);
//         return next(error);
//     }

//     // Validate phone number length
//     if (phonenumber.length !== 9) {
//         const error = new HttpError("Phone number is not valid", 422);
//         return next(error);
//     }

//     let hashedPassword;
//     try {
//         hashedPassword = await bcrypt.hash(password, 12);
//     } catch (err) {
//         const error = new HttpError("Could not create user, try again later", 500);
//         console.error("Error during password hashing:", err);
//         return next(error);
//     }
   
 
//     // Default money
//     const Money = money || 1400;
//     const ref = referred || 2;
//     const Transaction = transections || 2;
//     const Active = inactive || 2;


//     const createdUser = new User({
//         name,
//         phonenumber,
//         email,
//         password: hashedPassword,
//         money: Money,
//         transections : Transaction,
//         inactive : Active,
//         referred : ref,
    
    
//     });

//     try {
//         await createdUser.save();
//     } catch (err) {
//         console.error("Error saving user to database:", err.message, err);
//         return res.json({
//             success: false,
//             ErrorHandler: ErrorHandler.SIGNUP_FAILED
            
//         });
//     };
    

//     let token;
//     try {
//         const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';
//         token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, jwtSecret, { expiresIn: '3h' });
//         createdUser.token = token; // Assign token to user object
//         await createdUser.save(); // Save the updated user
//         // console.log("Generated Token:", token);

//     } catch (err) {
//         console.error("Error generating token:", err);
//          return res.json({
//             success: false,
//             ErrorHandler: ErrorHandler.ERROR_GENERATING_TOKEN
            
//         });
//     };
    

//     res.status(201).json({
//         message: "User created successfully",
//         otp : otp
        
//     });
// };

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "No valid data passed, update error"
        });
    }

    const { name, email, password } = req.body;
    console.log("Received data:", req.body);


    let existUser;
    try {
        existUser = await User.findOne({ email: email });
    } catch (err) {
        console.error("Error checking existing user:", err);
        return res.status(500).json({
            success: false,
            message: "Error checking user existence"
        });
    }

    // Immediately return if name is missing
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }

    if (existUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    const error = new HttpError("Email is not valid", 422);
    return next(error);
}


    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.error("Error during password hashing:", err);
        return res.status(500).json({
            success: false,
            message: "Could not create user, try again later"
        });
    }

    const createdUser = new User({
        email,
        password: hashedPassword,
        name
    });

    try {
        await createdUser.save();
    } catch (err) {
        console.error("Error saving user to database:", err.message, err);
        return res.status(500).json({
            success: false,
            message: "Error saving user to database"
        });
    }

    let token;
    try {
        const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, jwtSecret, { expiresIn: '3h' });
        createdUser.token = token; // Assign token to user object
        await createdUser.save(); // Save the updated user
    } catch (err) {
        console.error("Error generating token:", err);
        return res.status(500).json({
            success: false,
            message: "Error generating token"
        });
    }

    res.status(201).json({
        success: true,
        message: "User created successfully",
        token: token // Return the token as part of the response
    });
};


// for the android
// Log in a user
// export const login = async (req, res, next) => {
//     const { email, phonenumber, password } = req.body;
//     const error = validationResult(req);
//     if (!error.isEmpty()) {
//         return next(new HttpError("No valid data passed, update error", 422));
//     }
// for the web


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify phone number
        // if (existingUser.phonenumber !== phonenumber) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Invalid phone number"
        //     });
        // }

        // Compare hashed password
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // Generate JWT Token
        const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';
        const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            jwtSecret,
            { expiresIn: '3h' }
        );

        // Send success response with token
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: { 
                id: existingUser.id, 
                email: existingUser.email, 
                phonenumber: existingUser.phonenumber ,
                name: existingUser.name,
            },
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



export const recoverpassword = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new HttpError("No valid data passed, update error", 422));
    }
    

    const { email, password } = req.body;

    if (!email ) {
        return res.status(401).json({
            success: false,
            ErrorHandler: ErrorHandler.EMAIL_REQUIRED
            
        })
    }
    
    if(!password){
        return res.status(401).json({
            success: false,
            ErrorHandler: ErrorHandler.USER_PASSWORD_INCORRECT
            
        })

    }

    let user;
    try {
        // Find the user by email
        user = await User.findOne({ email: email });
    } catch (err) {
        console.error("Error finding user:", err);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.USER_NOT_EXIST
            
        });
    };

    if (!user) {
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.WRONG_USER
            
        });
    };

    // Compare the old password with the new password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        // If the old password is the same as the new one, return an error
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.USER_NOT_EXIST
            
        });
    };
    if (!error.isEmpty()) {
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.REQUEST_IS_EMPTY
            
        })
    
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
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.ERRORR_SAVING_USER
            
        });
    };

    res.status(200).json({ status: 'Password updated successfully', user: user.toObject({ getters: true }) });
};


export const editprofile = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new HttpError("No valid data passed, update error", 422));
    }

    const { email, name } = req.body;

    if (!email || !name) {
        console.log("Missing fields:", req.body);
        return res.status(401).json({
            success: false,
            ErrorHandler: ErrorHandler.ALL_FEILDS_REQUIRED
        });
    };
    let user;
    try {
        user = await User.findOne({ email: email });
    } catch (err) {
        // console.error("Error finding user:", err);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.ERRORR_SAVING_DRIVER
        });
    };


    if (!user) {
        // console.error("User not found:", email);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.USER_NOT_EXIST
        });
    };
    

    try {
        user.name = name;
        user.email = email;

        await user.save();
    } catch (err) {
        // console.error("Error saving user:", err);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.ERRORR_SAVING_PRIFILE
        });
    };

    res.status(200).json({ message: "Profile name updated successfully"});
};


export const generateOtpController = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new HttpError("No valid data passed, update error", 422));
    }
     
      const { phonenumber } = req.body;
  
      if (!phonenumber) {
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.USER_PHONE_NUMBER_REQUIRE
            
        });
        
    };
  
      let existingUser;
      try {
        existingUser = await User.findOne({ phonenumber: phonenumber });
      } catch (err) {
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.LOGIN_FAILED_FAILED
            
        });
    };
  
      if (!existingUser) {
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.USER_NOT_EXIST
            
        });
    };
    if(existingUser.phonenumber != phonenumber){
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.WRONG_PHONENUMBER
           
            
        });

    }
      
  

    //   if(existingUser){
    //     const error = new HttpError("User already exists, log in instead", 422);
    //     return next(error);
    //   }
  
      // Generate OTP
     
  
      // Optional: Log OTP for debugging (remove in production)
    //   console.log(`Generated OTP for ${phonenumber}: ${otp}`);
  
      // You might want to save the OTP to the user or session here for verification later
  
      return res.status(200).json({
        success: true,
        otp: otp,
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
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.FETCHING_USER_FAILED
            
        });
    };
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
        return next(new HttpError("No valid data passed, update error", 422));
    }
    

    const { name, phonenumber, tarigo, description, image, type } = req.body;
    console.log(req.body);

    if (!name && !phonenumber && !tarigo && !description && !image && !type) {
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.ALL_FEILDS_REQUIRED
            
        });
    }

    // Check if a driver with the same phone number already exists
    let existingDriver;
    try {
        existingDriver = await driver.findOne({ phonenumber: phonenumber });
    } catch (err) {
        console.error("Error checking existing driver:", err);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.COULD_NOT_CHECK_EXISTING_DRIVER
            
        });
    }

    if (existingDriver) {
        return next(new HttpError("Driver with this phone number already exists.", 422));
    }

    // Create the new driver
    const createdDriver = new driver({
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
            return next(new HttpError("No valid data passed, update error", 422));
        }
      
        const { phonenumber } = req.body;
    
        if (!phonenumber) {
            return res.status(401).json({
                success: false,
                ErrorHandler: ErrorHandler.USER_PHONE_NUMBER_REQUIRE
                
            });
        };
    
        const allowedPhoneNumbers = ["615880177"]; 
        
        // Check if the provided phone number matches the allowed number
        if (!allowedPhoneNumbers.includes(phonenumber)) {
            return res.json({
                success: false,
                ErrorHandler: ErrorHandler.ALLOWE_PHONENUMEBR
                
            });
        };
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
        return next(new HttpError("No valid data passed, update error", 422));
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
            return res.json({
                success: false,
                ErrorHandler: ErrorHandler.ALLOWE_PHONENUMEBR
                
            });
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
            return res.json({
                success: false,
                ErrorHandler: ErrorHandler.ERRORR_SAVING_FEEDBACK
                
            });
        }
        // Respond with success
    } catch (error) {
        console.error("Error processing customer feedback:", error);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.SERVER_ERROR
            
        });
    };
};
export const getmarketdetails = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("No valid data passed, update error", 422));
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'id is required.'
        });
    }

    try {
        // Fetch market details from the database
        const marketDetails = await User.findById(id);
    


        if (!marketDetails ||marketDetails == null) {
            return res.status(404).json({
                success: false,
                message: 'Market details not found.'
            });
        }
       

        // Destructure fields from marketDetails
        const {
            name,
            phonenumber,
            picture,
            email,
            token,
        } = marketDetails;



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
                is_approved: 0,
                is_called: 0,
                is_from_quality: 0,
                favorate_provider: 0,
                is_points: 0,
                total_points: 0,
                KYC_called: 0,
                view_otp: 0,
                rate: 0,
                rate_count: 0,
                wallet: 0,
                is_use_wallet: 0,
            },
            total_trip_earned: 0.00,
        });
        // Respond with market details
        
    } catch (err) {
        console.error('Error fetching market details:', err);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.FETCHING_USER_FAILED
            
        });
    }
};

export const Trip = async(req,res,next)=>{
    const errors = validationResult(req);
  

    const {phonenumber,destnation,location}= req.body

    let existingTrip;
try{
    existingTrip = await trip.findOne({phonenumber});
    
    if(existingTrip){
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.TRIP_ALREDY_EXIST
            
        });
    }

    if(!phonenumber){
        return next(new HttpError("phone required", 403));
    };
    if(!destnation){
        return next(new HttpError("destnation required", 403));
    };
    if(!location){
        return next(new HttpError("location required", 403));
    };


    const createdTrip = new trip({destnation,location,phonenumber});   
    await createdTrip.save();



    res.status(200).json({
        success: true,
        status: 200,
        message: "trip created successfully",
    
    });
    
    
    }catch(err){
        console.error('trip erro:', err);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.CREATING_TRIP_FAILED
            
        });
    };
};


export const getUserByToken = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("No valid data passed, update error", 422));
    }
    

    const {token} = req.body;

    if(!token){
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.TOKEN_REQUIRE
            
        });
    }
    
    
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.json({
                success: false,
                ErrorHandler: ErrorHandler.WRONG_USER
                
            });
        }
        

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phonenumber: user.phonenumber,
                
            },
        });
    } catch (err) {
        console.error('Error fetching user by token:', err);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.FETCHING_USER_BY_TOKEN
            
        });
    }
}
export const weblogin = async(req,rs,next)=>{
    r
}

export const loginPage = async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);  // Current file's URL converted to path
    const __dirname = dirname(__filename);  // Directory name of the current file
    const filePath = path.join(__dirname, 'views', 'index.html');  // Absolute path to the HTML file
    
    // Send the HTML file
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("File not found:", err);
            res.status(404).send("File Not Found");
        }
    });
};

// createTableDta
export const getdata = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("No valid data passed, update error", 422));
    }
    const { name, email } = req.body;
    let existUser;
    try {
        existUser = await tabledata.findOne({ email: email });
    } catch (err) {
        console.error("Error checking existing user:", err);
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.SIGNUP_FAILED
        
        });
    
    }
    if (existUser) {
        return res.json({
            success: false,
            ErrorHandler: ErrorHandler.USER_EXIST
            
        });
    };
    try{
        // Save data to the Table collection
        const dataTable = new tabledata({
            name,
            email
        });
        await dataTable.save();

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                id: user._id,
                email: user.email,
            }
        });

    } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: ErrorHandler.FETCHING_USER_FAILED
        });
    }
};




export const getTabledata = async (req, res, next) => {
    try {
        // Fetch all users from the database
        const Tabledata = await tabledata.find();

        // Send the fetched users as a response
        res.status(200).json({
            success: true,
            data: Tabledata
        });

    } catch (err) {
        console.error('Error fetching users:', err);
        
        // Send an error response
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};



//  fetching one user
export const deletetable = async (req, res) => {
    const { id } = req.query; // Get ID from request

    try {
        const userData = await tabledata.findById(id);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //  Delete the user by ID
        await tabledata.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Row deleted successfully",
        });

    } catch (err) {
        console.error("Error deleting row:", err);
        return res.status(500).json({
            success: false,
            message: "Error deleting row",
        });
    }
};




export const updateTable = async (req, res) => {
    const { id } = req.query; // Get ID from request
    const { email } = req.body; // Get new email from request body

    try {
        const userData = await tabledata.findById(id);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update the email
        userData.email = email;
        await userData.save();

        res.status(200).json({
            success: true,
            message: "Email updated successfully",
            user: userData
        });

    } catch (err) {
        console.error("Error updating email:", err);
        return res.status(500).json({
            success: false,
            message: "Error updating email",
        });
    }
};


// Transactions crate

export const transactions = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: "Invalid data", errors: errors.array() });
    }

    const { userId, amount, type, category, note } = req.body;

    try {
        // Check required fields
        if (!userId || !amount || !type || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields (userId, amount, type, category) are required"
            });
        }

        // Create and save transaction
        const transaction = new Transaction({
            userId,
            amount,
            type,
            category,
            note: note || "" // Optional field
        });

        await transaction.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction
        });

    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


export const getTransactions = async (req,res ) =>{
    try {
        const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(transactions);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

export const delTransactions = async (req,res)=>{

    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };


export const summaryTransactions = async (req,res)=>{
    try {
        const income = await Transaction.aggregate([
          { $match: { userId: req.params.userId, type: "income" } },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
    
        const expenses = await Transaction.aggregate([
          { $match: { userId: req.params.userId, type: "expense" } },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
    
        res.json({
          income: income[0]?.total || 0,
          expenses: expenses[0]?.total || 0
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

export const getAllTransactions = async (req, res) => {
    try {
        // Retrieve all transactions and sort by date (descending)
        const transactions = await Transaction.find().sort({ date: -1 });

        // If no transactions are found
        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found" });
        }

        // Respond with the transactions
        res.json(transactions);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: error.message });
    }
};
