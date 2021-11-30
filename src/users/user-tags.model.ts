import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "./users.model";
import {Tag} from "../tags/tags.model";
import {ApiProperty} from "@nestjs/swagger";

interface UserTagCreationAttrs {
    userUid: string;
    tagId: string;
}

@Table({tableName: 'user_tags'})
export class UserTag extends Model<UserTag, UserTagCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор тега, добавленного пользователем'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000', description: 'Уникальный идентификатор пользователя, добавившего тег'})
    @ForeignKey(() => User)
    @Column({type: DataType.UUID, onDelete: 'CASCADE'})
    userUid: string;

    @ApiProperty({example: '1', description: 'Уникальный идентификатор тега'})
    @ForeignKey(() => Tag)
    @Column({type: DataType.INTEGER, onDelete: 'CASCADE'})
    tagId: string;

    @BelongsTo(() => Tag)
    tag: Tag;

    @BelongsTo(() => User)
    user: User
}