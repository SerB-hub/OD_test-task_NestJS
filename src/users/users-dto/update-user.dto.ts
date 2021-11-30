import {IsEmail, IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {IsStrongPassword} from "../../pipes/validation-decorators/password-validate.decorator";
import {ApiProperty} from "@nestjs/swagger";


export class UpdateUserDto {
    @ApiProperty({example: 'user@gmail.com', description: 'Почтовый адрес', required: false})
    @IsOptional()
    @IsString({message: "Должно быть строкой"})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email?: string;
    @ApiProperty({example: 'Qwerty123', description: 'Пароль', required: false})
    @IsOptional()
    @IsString({message: "Должно быть строкой"})
    @MinLength(8,{message: "Не меньше 8 символов"})
    @IsStrongPassword({message: "Должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы"})
    readonly password?: string;
    @ApiProperty({example: 'Yujiro', description: 'Псевдоним', required: false})
    @IsOptional()
    @IsString({message: "Должно быть строкой"})
    @MaxLength(15, {message: "Не больше 15 символов"})
    readonly nickname?: string;
}