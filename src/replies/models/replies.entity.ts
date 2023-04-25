import { Post } from 'src/posts/models/posts.entity';
import { User } from 'src/users/models/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;

  @Column()
  edited: boolean;

  @ManyToOne(() => Post, (post) => post.replies, { nullable: false })
  post: Post;

  @ManyToOne(() => User, (user) => user.replies, { nullable: false })
  user: User;
}
