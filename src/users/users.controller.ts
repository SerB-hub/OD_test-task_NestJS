import {Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UpdateUserDto} from "./users-dto/update-user.dto";
import {AddUserTagsDto} from "./users-dto/add-userTags.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ReqUser} from "../decorators/logged-in-user.decorator";
import {RequestUser} from "../interfaces/request-interfaces/request-user";
import {TokenRevokedAuthGuard} from "../auth/token-revoked-auth.guard";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('user')
export class UsersController {

    constructor(private userService: UsersService) {}

    @ApiOperation({summary: 'Получить пользователя с добавленными им тегами'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Get()
    getUser(@ReqUser() reqUser: any) {
        return this.userService.getUser(reqUser);
    }

    @ApiOperation({summary: 'Обновить данные пользователя'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Put()
    updateUser(@ReqUser() reqUser: RequestUser, @Body() userDto: UpdateUserDto) {
        return this.userService.updateUser(reqUser, userDto);
    }

    @ApiOperation({summary: 'Удалить пользователя'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Delete()
    deleteUser(@ReqUser() reqUser: RequestUser, @Headers() headers: any) {
        this.userService.deleteUser(reqUser, headers).then(r => {});
    }

    @ApiOperation({summary: 'Добавить теги пользователю'})
    @ApiResponse({status: 201})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Post('/tag')
    addUserTags(@ReqUser() reqUser: RequestUser, @Body() userTagsDto: AddUserTagsDto) {
        return this.userService.addUserTags(reqUser, userTagsDto);
    }

    @ApiOperation({summary: 'Удалить добавленный тег'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Delete('/tag/:id')
    deleteUserTag(@ReqUser() reqUser: RequestUser, @Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUserTag(reqUser, id);
    }

    @ApiOperation({summary: 'Получить теги, создателем которых является пользователь'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Get('tag/my')
    getCreatorTags(@ReqUser() reqUser: RequestUser) {
        return this.userService.getCreatorTags(reqUser);
    }

}
