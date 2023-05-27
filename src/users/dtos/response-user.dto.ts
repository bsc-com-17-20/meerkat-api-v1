import { Post } from '../../posts/models/posts.entity';
import { Reply } from '../../replies/models/replies.entity';
import { Role } from '../models/role.enum';
import { Status } from '../models/status.enum';

export class ResponseUserDto {
  id: number;
  role: Role;
  username: string;
  email: string;
  imageURL: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
  replies: Reply[];
  status: Status;
  confimationCode: string;
}
