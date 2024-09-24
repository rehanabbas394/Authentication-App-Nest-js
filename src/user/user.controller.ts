import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignupDto } from './dto/user.signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user.signin.dto';
import { Currentuser } from 'src/utility/decorator/current.user.decorator';
import { AuthorizeRoles } from 'src/utility/decorator/authorize.role.decorator';
import { Roles } from 'src/utility/common/user.role.enum';
import { AuthenticationGuard } from 'src/utility/Guard/authentication.guard';
import { AuthorizeGuard } from 'src/utility/Guard/autorization.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupdto:UserSignupDto): Promise<UserEntity>{
    return await this.userService.signup(signupdto)
  }

  @Get('/:email')
  async Findbyemail(@Param('email') email:string):Promise<UserEntity>{
    return await this.userService.findbyEmail(email);
  }

  @Post('signin')
  async signin(@Body() signindto: UserSignInDto) {
    console.log("Received email for signin:", signindto.email);
    if (!signindto.email || !signindto.password) {
      throw new BadRequestException('Invalid credentials');
    }
    const user = await this.userService.signIn(signindto);
    const accesstoken = await this.userService.AccessToken(user);
    return { accesstoken, user };
  
  }
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('all')
    @AuthorizeRoles('ADMIN')
    @UseGuards(AuthenticationGuard, AuthorizeGuard)
    async findAll(): Promise<UserEntity[]> {
        return await this.userService.findAll();
    }

  @Get('findone/:id')
  findOne(@Param('id') id: string):Promise<UserEntity> {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
    getProfile(@Currentuser() currentuser: UserEntity) {
        return currentuser;
    }
}
