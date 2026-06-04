import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LlantasService } from './llantas.service';
import { CreateLlantaDto } from './dto/create-llanta.dto';
import { UpdateLlantaDto } from './dto/update-llanta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('llantas')
@ApiBearerAuth() // Para que Swagger pida el token
@UseGuards(JwtAuthGuard) // Protege TODAS las rutas
@Controller('llantas')
export class LlantasController {
  constructor(private readonly llantasService: LlantasService) {}

  @Post()
  create(@Body() createLlantaDto: CreateLlantaDto) {
    return this.llantasService.create(createLlantaDto);
  }

  @Get()
  findAll() {
    return this.llantasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.llantasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLlantaDto: UpdateLlantaDto) {
    return this.llantasService.update(+id, updateLlantaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.llantasService.remove(+id);
  }
}
