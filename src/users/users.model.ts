import {Column, DataType, Default, HasMany, Model, Table} from "sequelize-typescript";
import {Tag} from "../tags/tags.model";
import {UserTag} from "./user-tags.model";
import {ApiProperty} from "@nestjs/swagger";


interface UserCreationAttrs {
    email: string;
    password: string;
    nickname: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {

    @ApiProperty({example: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000', description: 'Уникальный идентификатор'})
    @Default(DataType.UUIDV4)
    @Column({type: DataType.UUID, unique: true, primaryKey: true})
    uid: string;

    @ApiProperty({example: 'user@gmail.com', description: 'Почтовый адрес'})
    @Column({type: DataType.STRING(100), unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: 'Qwerty123', description: 'Пароль'})
    @Column({type: DataType.STRING(100), allowNull: false})
    password: string;

    @ApiProperty({example: 'Yujiro', description: 'Псевдоним'})
    @Column({type: DataType.STRING(30), unique: true, allowNull: false})
    nickname: string;

    @HasMany(() => UserTag)
    tags: UserTag[];

    @HasMany(() => Tag)
    createdTags: Tag[];
}

