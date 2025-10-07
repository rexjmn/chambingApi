
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return await this.skillsRepository.find({
      where: { activo: true },
      order: { categoria: 'ASC', nombre: 'ASC' }
    });
  }

  async findByIds(ids: string[]): Promise<Skill[]> {
    return await this.skillsRepository.findByIds(ids);
  }
}