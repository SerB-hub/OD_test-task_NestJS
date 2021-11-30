import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";


export class LoginUserDto {
    @ApiProperty({example: 'user@gmail.com', description: 'Почтовый адрес'})
    @IsString({message: "Должно быть строкой"})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string;
    @ApiProperty({example: 'Qwerty123', description: 'Пароль'})
    readonly password: string;
}