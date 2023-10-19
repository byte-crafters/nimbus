import { Controller, Get } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  @Get('/login')
  login(): string {
    return 'login';
  }

  @Get('/register')
  register(): string {
    return 'register';
  }
}
