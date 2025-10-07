import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
export declare class SkillsService {
    private skillsRepository;
    constructor(skillsRepository: Repository<Skill>);
    findAll(): Promise<Skill[]>;
    findByIds(ids: string[]): Promise<Skill[]>;
}
