import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../../boards/model/boards.entity';
import { User } from '../../users/models/users.entity';
import { Reply } from '../../replies/models/replies.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ default: false })
  edited: boolean;

  @ManyToOne(() => Board, (board) => board.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  board: Board;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Reply, (reply) => reply.post, { cascade: true })
  replies: Reply[];
}
