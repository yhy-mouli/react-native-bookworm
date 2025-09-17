
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    username: {
        type : String,
        required : true,
        unique : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    profileImage : {
        type : String,
        default : ""
    }
}, { timestamps : true});
// hash password befor saving the user to db
userSchema.pre("save", async function(next) {
   
       const salt = await bcrypt.genSalt(10);    
        this.password = await bcrypt.hash(this.password, salt);
   
    next();
});
// Compare Password Function
userSchema.methods.comparePassword = async function(userPassword){
    return bcrypt.compare(userPassword, this.password);
}

// Construir le model
const User = mongoose.model("User", userSchema);

//Exportation
export default User;
