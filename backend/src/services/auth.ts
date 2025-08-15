import * as jwt from "jsonwebtoken";
import { env } from "@/config/env";

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

class AuthService {
  private readonly secret: string;
  private readonly expiresIn: number;

  constructor() {
    this.secret = env.JWT_SECRET;
    this.expiresIn = 60 * 60 * 24 * 7; // 7 days in seconds
  }

  generateToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    const options: jwt.SignOptions = {
      expiresIn: this.expiresIn,
      issuer: "finance-tracker",
      audience: "finance-tracker-app",
    };
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      const options: jwt.VerifyOptions = {
        issuer: "finance-tracker",
        audience: "finance-tracker-app",
      };
      const decoded = jwt.verify(token, this.secret, options) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1];
  }
}

const authService = new AuthService();
export default authService;
