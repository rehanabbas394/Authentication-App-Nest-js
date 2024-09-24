import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class UserSignInDto{
    @IsNotEmpty({ message: 'Email cannot be null' })
    @IsEmail({}, { message: 'Please provide an email' })
    email:string

    @IsNotEmpty({ message: 'Password cannot be null' })
    @MinLength(5,{message: 'Password must be 5 Character'})
    password:string
}

