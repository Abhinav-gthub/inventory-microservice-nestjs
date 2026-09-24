import { Controller, Get } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Controller()
export class UserAuthorisation{
    constructor(private jwtService: JwtService){}
    @Get('login')
      getAccessToken(){
        const payload = {sub: 1}
        return{
          access_token: this.jwtService.sign(payload)
        }
      }
}