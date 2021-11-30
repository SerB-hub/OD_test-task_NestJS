import {
    CACHE_MANAGER,
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {CreateUserDto} from "./auth-dto/create-user.dto";
import {UsersService} from "../users/users.service";
import * as bcrypt from "bcryptjs";
import {User} from "../users/users.model";
import {JwtService} from "@nestjs/jwt";
import {LoginUserDto} from "./auth-dto/login-user.dto";
import {Cache} from "cache-manager";


@Injectable()
export class AuthService {

    constructor(@Inject(forwardRef(() => UsersService))
                private userService: UsersService,
                @Inject(CACHE_MANAGER) private cacheManager: Cache,
                private jwtService: JwtService) {}

    async signIn(userDto: CreateUserDto) {
        const emailCandidate = await this.userService.getUserByEmail(userDto.email);
        const nicknameCandidate = await this.userService.getUserByNickname((userDto.nickname));
        if (emailCandidate) {
            throw new HttpException('Пользователь с таким email cуществует', HttpStatus.BAD_REQUEST);
        }
        if (nicknameCandidate) {
            throw new HttpException('Пользователь с таким nickname существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword});
        return this.generateToken(user)
    }

    async login(userDto: LoginUserDto, headers: any) {
        const user = await this.validateUser(userDto);

        return this.generateToken(user);
    }

    // Записываем токен в кэш как отозванный,
    // время блокировки определяется из разницы между
    // моментом истечения срока действительности токена и
    // моментом разлогина пользователя.
    // Гуард аутентификации будет проверять входящие токены
    // на наличие в кэше и статус отозванного.
    // К моменту окончания времени блокировки токен снова будет доступен,
    // но уже просрочен.
    async logout(headers: any) {
        await this.revokeToken(headers);
    }

    async refreshJwt(user: User, headers: any) {
        await this.revokeToken(headers)

        return this.generateToken(user);
    }

    async generateToken(user: User) {
        const payload = {uid: user.uid, email: user.email, nickname: user.nickname};
        return {
            token: this.jwtService.sign(payload),
            expire: String(Number(process.env.EXPIRES_IN) / 1000)
            // Вариант для значений в минутах, часах и тд, например 30m
            //expire: String(parseInt(process.env.EXPIRES_IN) * 60)
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) {
            throw new UnauthorizedException({message: "Пользователя с таким email не существует"})
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: "Некорректный email или пароль"});
    }

    async revokeToken(headers: any) {
        if (headers.authorization) {
            const authHeader = headers.authorization;
            const token = authHeader.split(' ')[1];

            const decodedToken: any = this.jwtService.decode(token);
            if (typeof decodedToken === "object") {
                const blockingEndTime = +decodedToken.exp;
                const blockingStartTime = +((new Date().getTime() / 1000).toFixed());
                const blockingPeriod = blockingEndTime - blockingStartTime;
                await this.cacheManager.set(token, 'revoked', {ttl: blockingPeriod});
            }
        }
    }
}

