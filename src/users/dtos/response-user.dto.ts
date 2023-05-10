import { Post } from '../../posts/models/posts.entity';
import { Reply } from '../../replies/models/replies.entity';

export class ResponseUserDto {
  id: number;
  role: string;
  username: string;
  email: string;
  imageURL: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
  replies: Reply[];
}
