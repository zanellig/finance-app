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
  private readonly refreshExpiresIn: number;

  constructor() {
    this.secret = env.JWT_SECRET;
    this.expiresIn = 60 * 60 * 2; // 2 hours in seconds
    this.refreshExpiresIn = 60 * 60 * 24 * 7; // 7 days in seconds
  }

  generateToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    const options: jwt.SignOptions = {
      expiresIn: this.expiresIn,
      issuer: "finance-tracker",
      audience: "finance-tracker-app",
      algorithm: "HS256",
    };
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      const options: jwt.VerifyOptions = {
        issuer: "finance-tracker",
        audience: "finance-tracker-app",
        algorithms: ["HS256"],
      };
      const decoded = jwt.verify(token, this.secret, options) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  generateRefreshToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    const options: jwt.SignOptions = {
      expiresIn: this.refreshExpiresIn,
      issuer: "finance-tracker",
      audience: "finance-tracker-refresh",
      algorithm: "HS256",
    };
    return jwt.sign(payload, this.secret, options);
  }

  verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const options: jwt.VerifyOptions = {
        issuer: "finance-tracker",
        audience: "finance-tracker-refresh",
        algorithms: ["HS256"],
      };
      const decoded = jwt.verify(token, this.secret, options) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error("Refresh token verification failed:", error);
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
