import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // Use environment variables for production
      signOptions: { expiresIn: '4h' },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
