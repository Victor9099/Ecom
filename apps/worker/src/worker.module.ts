import { Logger, Module, type OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
})
export class WorkerModule implements OnModuleInit {
  onModuleInit() {
    Logger.log('worker module initialized', 'WorkerModule');
  }
}
