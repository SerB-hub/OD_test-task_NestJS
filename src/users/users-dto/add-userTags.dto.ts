import {ArrayMinSize, IsArray} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";


export class AddUserTagsDto {
    @ApiProperty({example: '[1, 2, 3]', description: 'Массив id тегов'})
    @IsArray({message: "Должен быть массивом"})
    @ArrayMinSize(1, {message: "Должен содержать не меньше одного элемента"})
    readonly tags: number[];
}