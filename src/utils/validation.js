const validator=require('validator')


const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body
    if(!firstName){
        throw new Error("Enter valid Name")
    }
    else if (firstName.length<3 && firstName.length>50){
        throw new Error("Name should be in between 4 to 50 char")
    }

    else if (!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password,{
        minLength:8,
        minNumbers:1,
        minSymbols:1,
        minUppercase:1,

    }))
    throw new Error("Enter strong password")
}

const validatePassword=(password)=>{

    if(!validator.isStrongPassword(password,{
        minLength:8,
        minNumbers:1,
        minSymbols:1,
        minUppercase:1,
    })) throw new Error("Enter strong password");
}
const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];

    return Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    )


};
module.exports={
    validateSignUpData,
    validateEditProfileData,
    validatePassword
}