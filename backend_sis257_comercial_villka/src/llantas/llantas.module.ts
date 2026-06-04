import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Llanta } from './entities/llanta.entity';
import { LlantasService } from './llantas.service';
import { LlantasController } from './llantas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Llanta])],
  controllers: [LlantasController],
  providers: [LlantasService],
})
export class LlantasModule {}
