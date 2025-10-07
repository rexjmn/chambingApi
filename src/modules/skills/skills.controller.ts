import { Controller, Get } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll() {
    try {
      const skills = await this.skillsService.findAll();
      return {
        status: 'success',
        data: skills
      };
    } catch (error) {
      throw new Error('Error obteniendo habilidades');
    }
  }
}

