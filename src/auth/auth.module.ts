import {CacheModule, forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {JWT_MODULE_OPTIONS} from "@nestjs/jwt/dist/jwt.constants";
import {UsersService} from "../users/users.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      forwardRef(() => UsersModule),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || 'SECRET',
        signOptions: {
          expiresIn: process.env.EXPIRES_IN || '30m',
        }
      }),
      CacheModule.register(),
  ],
    exports: [
        AuthService,
        JwtModule,
        CacheModule
    ]
})
export class AuthModule {}
