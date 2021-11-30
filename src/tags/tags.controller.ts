import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import {TagsService} from "./tags.service";
import {CreateTagDto} from "./tags-dto/create-tag.dto";
import {UpdateTagDto} from "./tags-dto/update-tag.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RequestUser} from "../interfaces/request-interfaces/request-user";
import {ReqUser} from "../decorators/logged-in-user.decorator";
import {TokenRevokedAuthGuard} from "../auth/token-revoked-auth.guard";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ApiImplicitQuery} from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

@Controller('tag')
export class TagsController {

    constructor(private tagService: TagsService) {}

    @ApiOperation({summary: 'Создать тег'})
    @ApiResponse({status: 201})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Post()
    createTag(@ReqUser() reqUser: RequestUser, @Body() tagDto: CreateTagDto) {
        return this.tagService.createTag(reqUser, tagDto);
    }

    @ApiOperation({summary: 'Получить тег'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Get('/:id')
    getTagById(@Param('id', ParseIntPipe) id: number) {
        return this.tagService.getTagById(id);
    }
    @ApiImplicitQuery({
        name: 'sortByOrder',
        required: false,
        description: 'Сортировка по столбцу sortOrder'
    })
    @ApiImplicitQuery({
        name: 'sortByName',
        required: false,
        description: 'Сортировка по имени тега'
    })
    @ApiImplicitQuery({
        name: 'offset',
        required: false,
        example: '10',
        description: 'Смещение от начала списка'
    })
    @ApiImplicitQuery({
        name: 'length',
        required: false,
        example: '10',
        description: 'Количество элементов в выдаче'
    })
    @ApiOperation({summary: 'Получить теги'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Get()
    getTags(@Query() query) {
        return this.tagService.getTags(query);
    }

    @ApiOperation({summary: 'Изменить тег'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Put('/:id')
    updateTag(@ReqUser() reqUser: RequestUser, @Param('id', ParseIntPipe) id: number, @Body() tagDto: UpdateTagDto) {
        return this.tagService.updateTag(reqUser, id, tagDto);
    }

    @ApiOperation({summary: 'Удалить тег'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @UseGuards(TokenRevokedAuthGuard)
    @Delete('/:id')
    deleteTag(@ReqUser() reqUser: RequestUser, @Param('id', ParseIntPipe) id: number) {
        this.tagService.deleteTag(reqUser, id).then(r => {});
    }
}
