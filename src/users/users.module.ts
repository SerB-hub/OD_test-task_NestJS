import {forwardRef, Module} from '@nestjs/common';
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {AuthModule} from "../auth/auth.module";
import {UserTag} from "./user-tags.model";
import {TagsModule} from "../tags/tags.module";
import {UserTagsService} from "./user-tags.service";


@Module({
    controllers: [UsersController],
    providers: [UsersService, UserTagsService],
    imports: [
        forwardRef(() => AuthModule),
        TagsModule,
        SequelizeModule.forFeature([User, UserTag])
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule {}
