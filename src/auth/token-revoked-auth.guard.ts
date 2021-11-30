import {CACHE_MANAGER, CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {Cache} from "cache-manager";
import {Observable} from "rxjs";

@Injectable()
export class TokenRevokedAuthGuard implements CanActivate {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];

            // this.cacheManager.get(token).then(revokedToken => {
            //     if (revokedToken && revokedToken === 'revoked') {
            //         throw new UnauthorizedException({message: "Пользователь не авторизован"});
            //     }
            // });
            const revokedToken = await this.cacheManager.get(token);

            if (revokedToken && revokedToken === 'revoked') {
                throw new UnauthorizedException({message: "Пользователь не авторизован"});
            }

            return true;
        } catch (e) {
            throw new UnauthorizedException({message: "Пользователь не авторизован"});
        }
    }
}