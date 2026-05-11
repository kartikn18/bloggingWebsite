import { userServices } from "../services/user.services";
import { Request, Response } from "express";
import redisclient from "../config/redis";

const WINDOW_SIZE = 5 * 60;
const MAX_ATTEMPTS = 3;

export const usercontroller = {
  async registeruser(req: Request, res: Response) {
    const { email, username, password } = req.body;

    try {
      const user = await userServices.registeruser(
        email,
        username,
        password
      );

      res.statusMessage = "REGISTERED: User registered successfully";
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  },

  async loginuser(req: Request, res: Response) {
    const { email, password } = req.body;

    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const blockedip = `blocked:${ip}`;
    const attemptskey = `attempts:${ip}`;

    try {
      const isBlocked = await redisclient.exists(blockedip);

      if (isBlocked) {
        return res.status(403).json({
          message: "Too many login attempts. Try again after 5 minutes.",
        });
      }

      const { existing, refreshtoken, accesstoken } =
        await userServices.loginuser(email, password);

     
      await redisclient.del(attemptskey);

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.statusMessage = "LOGGEDIN: User logged in successfully";

      return res.status(200).json({
        user: existing,
        accesstoken,
      });
    } catch (error) {
      const attempts = await redisclient.incr(attemptskey);

      if (attempts === 1) {
        await redisclient.expire(attemptskey, WINDOW_SIZE);
      }

      if (attempts >= MAX_ATTEMPTS) {
        await redisclient.set(blockedip, "1", "EX", WINDOW_SIZE);
      }

      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  },
};