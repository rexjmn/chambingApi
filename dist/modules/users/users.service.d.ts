import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AwsService } from '../aws/aws.service';
export declare class UsersService {
    private usersRepository;
    private readonly awsService;
    constructor(usersRepository: Repository<User>, awsService: AwsService);
    updateProfilePhoto(userId: string, file: Express.Multer.File): Promise<User>;
    private getKeyFromUrl;
    create(createUserDto: CreateUserDto): Promise<User>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
    getUserRoles(userId: string): Promise<string[]>;
}
