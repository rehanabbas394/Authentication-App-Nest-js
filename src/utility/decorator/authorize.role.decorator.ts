import { SetMetadata } from '@nestjs/common';

export const AuthorizeRoles = (...roles) => SetMetadata('AllowedRoles', roles);