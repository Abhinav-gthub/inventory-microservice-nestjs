import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw new UnauthorizedException("Missing or invalid token");
        }

        const token = authHeader.split(' ')[1]

        try{
            const payload = await this.jwtService.verifyAsync(token,{
                secret: 'MY_SUPER_SECRET_KEY',
            });
            request['user'] = payload;
        }
        catch{
            throw new UnauthorizedException('Token has expired or is invalid');
        }

        return true
    }
}