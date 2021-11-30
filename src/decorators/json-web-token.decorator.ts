import {createParamDecorator, ExecutionContext} from "@nestjs/common";


export const Jwt = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    return token;
});