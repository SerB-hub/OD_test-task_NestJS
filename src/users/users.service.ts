import {Body, forwardRef, HttpException, HttpStatus, Inject, Injectable, Param, ParseIntPipe} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "../auth/auth-dto/create-user.dto";
import {UpdateUserDto} from "./users-dto/update-user.dto";
import {UserTag} from "./user-tags.model";
import {RequestUser} from "../interfaces/request-interfaces/request-user";
import * as bcrypt from "bcryptjs";
import {AuthService} from "../auth/auth.service";
import {AddUserTagsDto} from "./users-dto/add-userTags.dto";
import {TagsService} from "../tags/tags.service";
import {UserTagsService} from "./user-tags.service";
import {Tag} from "../tags/tags.model";


@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                @Inject(forwardRef(() => AuthService))
                private authService: AuthService,
                private tagService: TagsService,
                private userTagsService: UserTagsService
    ) {}

    async createUser(userDto: CreateUserDto) {
        const user = await this.userRepository.create(userDto);
        return user;
    }

    async getUser(reqUser: RequestUser) {
        return this.getUserByEmail(reqUser.email, ['email', 'nickname'])
    }

    async updateUser(reqUser: RequestUser, userDto: UpdateUserDto) {
        if (userDto && Object.keys(userDto).length !== 0) {
            const user = await this.getUserByEmail(reqUser.email);

            if (userDto.email) {
                const emailCandidate = await this.getUserByEmail(userDto.email);
                if (emailCandidate) {
                    throw new HttpException('Пользователь с таким email cуществует', HttpStatus.BAD_REQUEST);
                }
                user.email = userDto.email;
            }
            if (userDto.nickname) {
                const nicknameCandidate = await this.getUserByNickname((userDto.nickname));
                if (nicknameCandidate) {
                    throw new HttpException('Пользователь с таким nickname существует', HttpStatus.BAD_REQUEST);
                }
                user.nickname = userDto.nickname;
            }
            if (userDto.password) {
                const hashPassword = await bcrypt.hash(userDto.password, 5);
                user.password = hashPassword;
            }

            await user.save();

            // В ТЗ в примере ответа сервера указаны только email и nickname,
            // в этом случае, после обновления данных пользователя
            // прежний токен будет содержать неактуальные данные пользователя,
            // поэтому имеет смысл также вернуть клиенту новый токен
            // с обновленными данными.
            //
            // const token = await this.authService.generateToken(user);
            // return {"email": user.email, "nickname": user.nickname, ...token};

            return {"email": user.email, "nickname": user.nickname};
        }
    }

    async deleteUser(reqUser: RequestUser, headers: any) {
        try {
            await this.userRepository.destroy({where: {email: reqUser.email}, cascade: true});
        } catch(e) {
            console.log(e);
        }
        await this.authService.revokeToken(headers);
    }

    async addUserTags(reqUser: RequestUser, userTagsDto: AddUserTagsDto) {
        const tags = await this.tagService.getTagsById(userTagsDto);

        if (tags) {
            await this.userTagsService.createUserTags(reqUser.uid, tags);
            const userTags = await this.userTagsService.getUserTags(reqUser.uid,['id', 'name', 'sortOrder']);
            const prettyUserTags = userTags.map(userTag => userTag.tag)

            return {tags: prettyUserTags};
        }
    }

    async deleteUserTag(reqUser: RequestUser, id: number) {
        await this.userTagsService.deleteUserTagById(reqUser, id);
        const userTags = await this.userTagsService.getUserTags(reqUser.uid,['id', 'name', 'sortOrder']);
        const prettyUserTags = userTags.map(userTag => userTag.tag);

        return {tags: prettyUserTags};
    }

    async getCreatorTags(reqUser: RequestUser) {
        const userTags = await this.userTagsService.getUserTags(reqUser.uid);
        const creatorUserTags = userTags.filter(
            userTag => userTag.tag.creatorUid === reqUser.uid
        );
        const prettyCreatorUserTags = creatorUserTags.map(
            userTag => {
                return {
                    id: userTag.tag.id,
                    name: userTag.tag.name,
                    sortOrder: userTag.tag.sortOrder
                }
            }
        );

        return {tags: prettyCreatorUserTags};
    }

    async getUserByEmail(email: string, attrs: string[] = null) {
        let user;
        if (attrs && attrs.length) {
            user = this.userRepository.findOne(
                {
                    where: {email},
                    attributes: attrs,
                    include: UserTag
                });
        } else {
            user = await this.userRepository.findOne({
                where: {email}
            });
        }
        return user;
    }

    async getUserByNickname(nickname: string) {
        const user = await this.userRepository.findOne({
            where: {nickname},
        });
        return user;
    }
}
