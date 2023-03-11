import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AwsService } from 'nest-aws-sdk/dist/lib/types';
import { resolve } from 'path';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { ImageModule } from './modules/image/image.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { UserModule } from './modules/user/user.module';

@Module({
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
    },
  ],
  imports: [
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          region: configService.get<string>('AWS_REGION'),
        }),
      },
      services: [S3Client as AwsService],
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [resolve(__dirname, '**/*.entity.{ts,js}')],
        migrations: [resolve(__dirname, 'migrations/*.{ts,js}')],
        migrationsRun: true,
      }),
    }),
    UserModule,
    AuthModule,
    PortfolioModule,
    ImageModule,
    CommentModule,
  ],
})
export class AppModule {}
