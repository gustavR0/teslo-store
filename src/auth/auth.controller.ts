import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders } from 'src/common/decorators/raw-header.decorator';
import { IncomingHttpHeaders } from 'http';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces/valid-roles.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @RawHeaders() rowHeader: string[],
    @Headers() header: IncomingHttpHeaders,
  ) {
    return { user, rowHeader, header };
  }

  /* @SetMetadata(META_ROLES, ['admin', 'super-user']) */
  /* @RoleProtected(ValidRoles.superAdmin, ValidRoles.admin) */
  /* @UseGuards(AuthGuard(), UserRoleGuard) */
  @Get('private')
  @Auth(ValidRoles.user)
  privateRoute(@GetUser() user: User) {
    return { user };
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
