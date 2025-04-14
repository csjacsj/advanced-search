import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../advanced-search-ui', 'out'), // 设置静态文件的根目录
      serveRoot: '/ui', // 设置访问静态文件的路径前缀
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
