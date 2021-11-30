import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import {User} from "./users/users.model";
import { AuthModule } from './auth/auth.module';
import {Tag} from "./tags/tags.model";
import {UserTag} from "./users/user-tags.model";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Tag, UserTag],
            autoLoadModels: true,
            define: {
                timestamps: false
            }
        }),
        UsersModule,
        TagsModule,
        AuthModule,
    ]
})
export class AppModule {}