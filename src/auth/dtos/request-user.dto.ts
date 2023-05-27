import { Status } from '../../users/models/status.enum';

export class RequestUserDto {
  id: string;
  role: string;
  username: string;
  email: string;
  imageURL: string;
  createAt: Date;
  updatedAt: Date;
  status: string;
  confimationCode: string;
}

// {
//     "id": "11",
//     "role": "user",
//     "username": "denn1s",
//     "email": "dennis@gmail.com",
//     "imageURL": "/avatars/denn1s.svg",
//     "createdAt": "2023-04-28T13:41:50.000Z",
//     "updatedAt": "2023-04-28T13:41:50.000Z"
//   }
