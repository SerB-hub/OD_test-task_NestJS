import {Body, Controller, Get, Headers, Post, Req, UseGuards, UsePipes} from '@nestjs/common';
import {CreateUserDto} from "./auth-dto/create-user.dto";
import {LoginUserDto} from "./auth-dto/login-user.dto";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ReqUser} from "../decorators/logged-in-user.decorator";
import {TokenRevokedAuthGuard} from "./token-revoked-auth.guard";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";



@Controller()
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Зарегистрировать нового пользователя'})
    @ApiResponse({status: 201})
    @Post('/signin')
    signIn(@Body() userDto: CreateUserDto) {
        return this.authService.signIn(userDto);
    }

    @ApiOperation({summary: 'Залогиниться'})
    @ApiResponse({status: 201})
    @Post('/login')
    login(@Body() userDto: LoginUserDto, @Headers() headers: any) {
        return this.authService.login(userDto, headers);
    }

    @ApiOperation({summary: 'Разлогиниться'})
    @ApiResponse({status: 201})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Post('/logout')
    logout(@Headers() headers: any) {
        this.authService.logout(headers).then(r => {});
        // return this.authService.logout(token)
    }

    @ApiOperation({summary: 'Обновить токен'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Get('/refresh-jwt')
    refreshJwt(@ReqUser() user, @Headers() headers: any) {
        return this.authService.refreshJwt(user, headers);
    }
}
