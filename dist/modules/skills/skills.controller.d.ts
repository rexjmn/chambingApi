import { SkillsService } from './skills.service';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    findAll(): Promise<{
        status: string;
        data: import("./entities/skill.entity").Skill[];
    }>;
}
