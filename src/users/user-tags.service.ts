import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {UserTag} from "./user-tags.model";
import {Tag} from "../tags/tags.model";
import {User} from "./users.model";
import {RequestUser} from "../interfaces/request-interfaces/request-user";


@Injectable()
export class UserTagsService {

    constructor(@InjectModel(UserTag) private userTagRepository: typeof UserTag) {}

    async createUserTags(userUid: string, tags: Tag[]) {
        const records = [];

        for (let tag of tags) {
            records.push({
                userUid: userUid,
                tagId: tag.id
            })
        }

        const userTags = await this.userTagRepository.bulkCreate(records);

        return userTags;
    }

    async getUserTags(userUid: string, attrs: string[] = null) {
        let userTags;
        if (attrs && attrs.length) {
            userTags = await this.userTagRepository.findAll(
                {
                    where: {userUid},
                    include: [{model: Tag, attributes: attrs}]
                }
            );
        } else {
            userTags = await this.userTagRepository.findAll(
                {
                    where: {userUid},
                    include: Tag
                }
            );
        }

        return userTags;
    }

    async deleteUserTagById(reqUser: RequestUser, id: number) {
        await this.userTagRepository.destroy({where: {userUid: reqUser.uid, tagId: id}});
    }
}