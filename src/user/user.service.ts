import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user.signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user.signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepositry:Repository<UserEntity>
  ){}

  async signup(signdto:UserSignupDto): Promise<UserEntity>{ 
    const userExist = await this.findbyEmail(signdto.email)
    if (userExist) throw new BadRequestException({message:'email already exist'})
    const saltround=10
    signdto.password =await hash(signdto.password,saltround)
    let user = this.UserRepositry.create(signdto)
    user = await this.UserRepositry.save(user)
    delete user.password
    return user
  }

  async findbyEmail(email:string){
    return await this.UserRepositry.findOneBy({email})
  }

  async signIn(signindto: UserSignInDto): Promise<UserEntity> {
    console.log("Attempting to sign in with email:", signindto.email);
      const userexist = await this.UserRepositry.createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: signindto.email })
      .getOne();
  
    if (!userexist) {
      console.log("No user found with this email.");
      throw new BadRequestException({ message: 'Bad Credentials, please create an account and sign in.' });
    }
    const matchPassword = await compare(signindto.password, userexist.password);
    if (!matchPassword) {
      console.log("Password mismatch.");
      throw new BadRequestException({ message: 'Bad Credentials.' });
    }
  
    delete userexist.password;
    console.log("User found and password matched:", userexist);
    return userexist;
  }
  
  async AccessToken(user: UserEntity): Promise<string> {
    console.log("Generating access token for user:", user);
    return sign(
      { id: user.id, email: user.email },
      "ksdnkj0932kjsdnkmsdnm,nksdl",
      { expiresIn:'30m' }
    ); 
  }
  


  create(createUserDto: CreateUserDto) {
    return this.UserRepositry.create(createUserDto)
  }

  async findAll():Promise<UserEntity[]> {
    return await this.UserRepositry.find();
   
  }

  async findOne(id: number):Promise<UserEntity>{
    const user = await this.UserRepositry.findOneBy({id})
    if (!user) throw new NotFoundException('user not found')
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // const user = await this.UserRepositry.findOne(+id);

    // if(!user){
    //   throw new NotFoundException(`User with the id ${id} not found`)
    // }
    // this.UserRepositry.merge(user,updateUserDto)
    // return await this.UserRepositry.save(user)
  }

  async remove(id: number) {
    return await this.UserRepositry.delete(id)
  }
}
