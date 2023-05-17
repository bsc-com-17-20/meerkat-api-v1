import { Post } from '../../posts/models/posts.entity';
import { Reply } from '../../replies/models/replies.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './status.enum';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

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

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @Column({ unique: true })
  confimationCode: string;

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(() => Reply, (reply) => reply.user, { cascade: true })
  replies: Reply[];
}
