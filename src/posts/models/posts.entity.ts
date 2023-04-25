import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from 'src/boards/model/boards.entity';
import { User } from 'src/users/models/users.entity';
import { Reply } from 'src/replies/models/replies.entity';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  edited: boolean;

  @ManyToOne(() => Board, (board) => board.posts, { nullable: false })
  board: Board;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  user: User;

  @OneToMany(() => Reply, (reply) => reply.post)
  replies: Reply[];
}
