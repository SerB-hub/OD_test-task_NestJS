import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {AuthModule} from "../auth/auth.module";

@Module({
    controllers: [TagsController],
    providers: [TagsService],
    imports: [
        AuthModule,
        SequelizeModule.forFeature([Tag])
    ],
    exports: [TagsService]
})
export class TagsModule {}
