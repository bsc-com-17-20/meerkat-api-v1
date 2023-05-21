import { Post } from '../../posts/models/posts.entity';
import { User } from '../../users/models/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;

  @Column({ default: false })
  edited: boolean;

  @ManyToOne(() => Post, (post) => post.replies, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.replies, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
