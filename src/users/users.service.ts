import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {User, UsersDocument} from '../schemas/users.schema'
import {Model} from 'mongoose'
import {CreateUserDto} from '../auth/dto/create-user.dto'
import {LoginUserDto} from '../auth/dto/login-user.dto'
import * as bcrypt from 'bcryptjs'


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {
  }

  async login(loginUserDto: LoginUserDto): Promise<User | null> {
    const user = await this.usersModel.findOne({
      username: loginUserDto.username,
    })

    if (!user) {
      return null
    }

    return user as User
  };

  async registration(createUsersDto: CreateUserDto): Promise<User | null> {
    const existingUser = await this.usersModel.findOne({username: createUsersDto.username})

    if (existingUser) {
      return null
    }

    const salt = await bcrypt.genSalt(10);

    createUsersDto.password = await bcrypt.hash(createUsersDto.password, salt);

    const createdUser = new this.usersModel(createUsersDto)

    return createdUser.save()
  }

  async findOneUser(username: string): Promise<User> {
    return this.usersModel.findOne({username})
  }
}
