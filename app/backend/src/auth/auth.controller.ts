import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

interface AuthenticatedRequest extends Request {
  user: { idUser: number; email: string };
}

/**
 * Authentication and current-user endpoints: registration, login/logout
 * (JWT stored in an HttpOnly cookie) and self-service profile/password updates.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Register a new user account. */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'Account created.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** Authenticate and set the access_token JWT cookie. */
  @Post('login')
  @ApiOperation({ summary: 'Log in and receive the JWT cookie' })
  @ApiResponse({
    status: 201,
    description: 'Logged in; the access_token cookie is set.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  /** Clear the access_token cookie. */
  @Post('logout')
  @ApiOperation({ summary: 'Log out (clear the JWT cookie)' })
  @ApiResponse({
    status: 201,
    description: 'Logged out; the cookie is cleared.',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  /** Return the authenticated user (without the password hash). */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user profile.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  me(@Req() req: AuthenticatedRequest) {
    return this.authService.me(req.user.idUser);
  }

  /** Export the authenticated user's personal data as JSON (GDPR). */
  @Get('me/export')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Export the current user personal data (GDPR)' })
  @ApiResponse({ status: 200, description: 'JSON export of personal data.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  exportMyData(@Req() req: AuthenticatedRequest) {
    return this.authService.exportMyData(req.user.idUser);
  }

  /** Delete (anonymize + soft delete) the authenticated user's account (GDPR). */
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Delete the current account (GDPR right to erasure)',
  })
  @ApiResponse({
    status: 200,
    description: 'Account anonymized and deleted; the cookie is cleared.',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  deleteMe(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.deleteMe(req.user.idUser, res);
  }

  /** Update the authenticated user's profile. */
  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiResponse({ status: 200, description: 'Updated user profile.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    return this.authService.updateMe(req.user.idUser, dto);
  }

  /** Change the authenticated user's password. */
  @Patch('me/password')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Change the current user password' })
  @ApiResponse({ status: 200, description: 'Password changed.' })
  @ApiResponse({
    status: 400,
    description: 'Current password incorrect or new password invalid.',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.idUser, dto);
  }
}
