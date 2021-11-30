import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {CreateTagDto} from "./tags-dto/create-tag.dto";
import {RequestUser} from "../interfaces/request-interfaces/request-user";
import {User} from "../users/users.model";
import {UpdateTagDto} from "./tags-dto/update-tag.dto";
import {AddUserTagsDto} from "../users/users-dto/add-userTags.dto";
const { Op } = require("sequelize");

@Injectable()
export class TagsService {

    constructor(@InjectModel(Tag) private tagRepository: typeof Tag) {}

    async createTag(reqUser: RequestUser, tagDto: CreateTagDto) {
        const candidate = await this.tagRepository.findOne({where: {name: tagDto.name}});
        if (candidate) {
            throw new HttpException(
                'Тег с таким именем существует',
                HttpStatus.BAD_REQUEST
            );
        }
        const tagCreateValues = {
            "name": tagDto.name,
            "creatorUid": reqUser.uid
        }
        if (tagDto.sortOrder) {
            tagCreateValues["sortOrder"] = Number(tagDto.sortOrder);
        }

        const tag = await this.tagRepository.create(tagCreateValues);
        return tag;
    }

    async getTagById(id: number) {
        const tag = await this.tagRepository.findOne({
            where: {id},
            attributes: ['name', 'sortOrder'],
            include: [{model: User, attributes: ['nickname', 'uid']}]
        });
        if (!tag) {
            throw new HttpException(
                'Тега с таким id не существует',
                HttpStatus.NOT_FOUND
            );
        }
        return tag;
    }

    async getTags(query) {
        let {sortByOrder = null, sortByName = null, offset = null, length = null} = query;

        const order = 'ASC';
        const tagSelectOptions = {
            attributes: ['name', 'sortOrder'],
            include: [{model: User, attributes: ['nickname', 'uid']}],
            order: [],
            limit: length,
            offset: offset
        }

        if (sortByOrder === '') {
            tagSelectOptions.order.push(['sortOrder', order]);
        }
        if (sortByName === '') {
            tagSelectOptions.order.push(['name', order]);
        }
        // добавить метаданные
        const tags = await this.tagRepository.findAll(tagSelectOptions);

        const tagsWithMeta = {
            "data": tags,
            "meta": {
                offset,
                length,
                "quantity": tags.length
            }
        }

        return tagsWithMeta;
    }

    async updateTag(reqUser: RequestUser, id: number, tagDto: UpdateTagDto) {
        const tag = await this.getTagById(id);

        if (tag.creatorUid !== reqUser.uid) {
            throw new HttpException(
                'Нет прав доступа для изменения тега',
                HttpStatus.FORBIDDEN);
        }
        if (tagDto.name) {
            const nameCandidate = await this.tagRepository.findOne({
                where: {name: tagDto.name}
            });
            if (nameCandidate) {
                throw new HttpException(
                    'Тег с таким именем cуществует',
                    HttpStatus.BAD_REQUEST);
            }
            tag.name = tagDto.name;
        }
        if (tagDto.sortOrder) {
            tag.sortOrder = Number(tagDto.sortOrder);
        }

        await tag.save();

        return
    }

    async deleteTag(reqUser: RequestUser, id: number) {
        const tag = await this.getTagById(id);

        if (tag.creatorUid !== reqUser.uid) {
            throw new HttpException(
                'Нет прав доступа для удаления тега',
                HttpStatus.FORBIDDEN);
        }

        await tag.destroy()
    }

    async getTagsById(userTagsDto: AddUserTagsDto) {
        const tags = await this.tagRepository.findAll({where: {id: {[Op.in]: userTagsDto.tags}}})

        if (tags.length < userTagsDto.tags.length) return;

        return tags;
    }
}
