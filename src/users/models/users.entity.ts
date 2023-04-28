import { Post } from '../../posts/models/posts.entity';
import { Reply } from '../../replies/models/replies.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: 'user' })
  role: string;

  @Column('varchar', { length: 30, unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  imageURL: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  hash: string;

  @OneToMany(() => Post, (post) => post.user, {})
  posts: Post[];

  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];
}
