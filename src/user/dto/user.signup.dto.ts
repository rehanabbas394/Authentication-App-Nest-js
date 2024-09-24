import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserSignInDto } from "./user.signin.dto";


export class UserSignupDto{
    
    @IsNotEmpty({ message: 'Name cannot be null' })
    @IsString({ message: 'Name should be string' })
    username:string;

    @IsNotEmpty({ message: 'Email cannot be null' })
    @IsEmail({}, { message: 'Please provide an email' })
    email:string

    @IsNotEmpty({ message: 'Password cannot be null' })
    @MinLength(5,{message: 'Password must be 5 Character'})
    password:string

}

