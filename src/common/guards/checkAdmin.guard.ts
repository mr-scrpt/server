import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CheckAdmin implements CanActivate {
  constructor(
    @Inject(UserService) private readonly userService: UserService
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);

  }

  async validateRequest(request): Promise<boolean> {
    const token = request.header('Authorization').slice(7);
    if (!token) {
      return false;
    }
    return await this.userService.isAdminUser(token);
  }
}