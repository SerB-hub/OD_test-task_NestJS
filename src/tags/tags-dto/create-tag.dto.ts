import {IsNumberString, IsOptional, IsString, MaxLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";


export class CreateTagDto {
    @ApiProperty({example: 'Summer', description: 'Имя тега'})
    @IsString({message: "Должно быть строкой"})
    @MaxLength(20, {message: "Не больше 20 символов"})
    readonly name: string;
    @ApiProperty({example: '0', description: 'Порядок сортировки', required: false})
    @IsOptional()
    @IsNumberString({no_symbols: true}, {message: "Должно быть строкой с целым положительным числовым значением"})
    readonly sortOrder?: string;
}