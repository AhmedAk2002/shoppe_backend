export const generateOtp = function (length) {
    try {
      if (typeof length === "undefined") length = 4;
      var otpCode = "";
      var possible = "123456789";
      for (var i = 0; i < length; i++)
        otpCode += possible.charAt(Math.floor(Math.random() * possible.length));
      return otpCode;
    } catch (error) {
      // console.error(error);
    
    }
  };
// xaraf
// function generateAlphanumericOtp(length = 6) {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let otp = '';
//     for (let i = 0; i < length; i++) {
//         otp += characters[Math.floor(Math.random() * characters.length)];
//     }
//     return otp;
// }

// // Example usage:
// const otp = generateAlphanumericOtp();
// console.log('Generated OTP:', otp);