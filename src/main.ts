import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path'; // node 의 path 모듈에서 함수로, 크로스 플랫폼 파일 경로를 생성하는데 사용

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**
   * app.useStaticAssets
   * 정적파일 (JS, CSS) 을 서빙하기 위한 디렉토리 설정, public 폴더 지정
   * app.setBaseViewsDir
   * 템플릿 엔진이 사용할 뷰 파일들이 있는 디렉토리를 설정
   * app.setViewEngine
   * 애플리케이션의 뷰 엔진으로 Handlebars(hbs)를 지정, 이를 통해 서버 사이드에서 HTML 을 동적으로 생성가능
   */

  app.useStaticAssets(join(__dirname, '..', 'public')); // js css 정적 파일 서빙
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // 템플릿엔진 위치
  app.setViewEngine('hbs'); // viewEngine 지정

  await app.listen(3000);
}
bootstrap();
