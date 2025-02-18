export const ERROR_CODE = {
    USER_NAME_NOT_FOUND: (404, "User not found"),
    USER_PASSWORD_INCORRECT: (401, "Password incorrect"),
    USER_PHONE_NUMBER_REQUIRE:(404, "Phone number require"),
    USER_EXIST:(422,"User already exist"),
    DRIVER_ALREDY_EXIST:(422,"Driver already exist"),
    TRIP_ALREDY_EXIST:(422,"Trip already exist"),
    LOGIN_FAILED:(500,"Logging in failed, please try again later."),
    REQUEST_IS_EMPTY:(422,"No valid data passed, update error"),
    EMAIL_REQUIRED:(422,"Email required"),
    WRONG_USER:(500,"Wrong user"),
    FETCHING_USER_FAILED:(500,"Error fetching user"),
    SIGNUP_FAILED:(500,"ERROR SIGNNING IN"),
    EMAIL_NOT_VALID:(422,"email not valid"),
    ERROR_GENERATING_TOKEN:(500,"Signing up/token failed, try again later"),
    INVALID_PHONENUMBER:(404, "Invalid number, could not log you in"),
    USER_NOT_EXIST:(500,"User not exist"),
    PASSWORD_IS_THE_SAME:(400,"New password cannot be the same as the old password"),
    ERRORR_SAVING_USER:(500,"Something went wrong while saving the user"),
    ERRORR_SAVING_DRIVER:(500,"Something went wrong while saving the driver"),
    ERRORR_SAVING_PRIFILE:(500,"Something went wrong while saving the profile"),
    ERRORR_SAVING_FEEDBACK:(500,"Something went wrong while saving the feedback"),
    ALL_FEILDS_REQUIRED:(422,"All fields are required"),
    PLEASE_TRY_AGAIN:(500,"please try again later"),
    COULD_NOT_CHECK_EXISTING_DRIVER:(411,"Could not check for existing driver, please try again later."),
    ALLOWE_PHONENUMEBR:(403,"Phone number not allowed"),
    SERVER_ERROR:(500,"Server error"),
    FETCHING_MARKET_DETAILS_FAILED:(500,"Error fetching market"),
    CREATING_TRIP_FAILED:(500,"creating trip failed."),
    TOKEN_REQUIRE:(422,"Token require"),
    FETCHING_USER_BY_TOKEN:(500,"Eroor fretchign user by token"),
    LOGIN_FAILED_FAILED:(500,"ERROR login IN"),
    WRONG_PHONENUMBER:(500,"Wrong number"),
    WRONG_EMAIL:(500,"Wrong email"),
    USER_NAME_REQUUIRED:(422,"Name required"),






    



    


}
export default ERROR_CODE;



  