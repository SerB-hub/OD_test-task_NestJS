import {BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {UserTag} from "../users/user-tags.model";
import {ApiProperty} from "@nestjs/swagger";


interface TagCreationAttrs {
    name: string;
    sortOrder?: number;
    creatorUid: string;
}

@Table({tableName: 'tags'})
export class Tag extends Model<Tag, TagCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    // При назначении одного имени столбцу внешнего ключа
    // и ассоциациативному элементу возникает коллизия,
    // поэтому внешний ключ и ассоциативный элемент
    // имеют разные имена
    @ApiProperty({example: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000', description: 'Уникальный идентификатор создателя тега'})
    @ForeignKey(() => User)
    @Column({type: DataType.UUID})
    creatorUid: string;

    @ApiProperty({example: 'Summer', description: 'Имя тега'})
    @Column({type: DataType.STRING(40), unique: true, allowNull: false})
    name: string;

    @ApiProperty({example: '0', description: 'Порядок сортировки'})
    @Default(0)
    @Column({type: DataType.INTEGER, allowNull: false})
    sortOrder: number;

    @BelongsTo(() => User, {onDelete: 'CASCADE'})
    creator: User;

    @HasMany(() => UserTag)
    userTags: UserTag[]
}