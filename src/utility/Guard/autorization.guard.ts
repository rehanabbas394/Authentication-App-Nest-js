import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

// @Injectable()
// export class AuthorizeGuard implements CanActivate{

//     constructor(private readonly reflector:Reflector){}

//     canActivate(context: ExecutionContext): boolean  {
//         const allowdRole = this.reflector.get<string[]>('AllowedRoles',context.getHandler())
//         const request = context.switchToHttp().getRequest()
//         const results = request?.currentuser?.roles.map((role:string)=>allowdRole.includes(role)).find((val:boolean)=>val===true)     
//         if (results) return true
//         throw new UnauthorizedException("Sorry! you are not authorized")   
//     }
// }




@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const allowedRoles = this.reflector.get<string[]>('AllowedRoles', context.getHandler());
        const request = context.switchToHttp().getRequest();

        // Ensure `currentuser` and `roles` are defined
        if (!allowedRoles) {
            throw new UnauthorizedException("No roles are specified for this route.");
        }

        if (!request?.currentuser || !Array.isArray(request.currentuser.roles)) {
            throw new UnauthorizedException("User roles are not defined or user is not authenticated.");
        }

        const hasRole = request.currentuser.roles
            .some((role: string) => allowedRoles.includes(role));

        if (hasRole) return true;
        throw new UnauthorizedException("Sorry! you are not authorized");
    }
}
