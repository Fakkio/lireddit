import DataLoader from "dataloader";
import {Request, Response} from "express";
import session from "express-session";
import {Redis} from "ioredis";
import {Updoot} from "./entities/Updoot";
import {User} from "./entities/User";

interface Session extends session.Session {
  userId?: number;
}

export type ResolverContext = {
  req: {session: Session} & Request;
  res: Response;
  redis: Redis;
  userLoader: DataLoader<number, User>;
  updootLoader: DataLoader<{postId: number; userId: number}, Updoot>;
};
