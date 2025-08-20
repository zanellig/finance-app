import redisService from "./redis";
import * as jwt from "jsonwebtoken";

class TokenBlacklistService {
  /**
   * Blacklist a token until its natural expiration
   */
  async blacklistToken(token: string): Promise<void> {
    try {
      // Decode token without verification to get expiration
      const decoded = jwt.decode(token) as { exp?: number } | null;

      if (!decoded || !decoded.exp) {
        // If we can't decode or no expiration, blacklist for 2 hours (max token lifetime)
        await redisService.blacklistToken(token, 60 * 60 * 2);
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpiry = decoded.exp - currentTime;

      // Only blacklist if token hasn't already expired
      if (timeToExpiry > 0) {
        await redisService.blacklistToken(token, timeToExpiry);
      }
    } catch (error) {
      console.error("Error blacklisting token:", error);
      // Fallback: blacklist for 2 hours
      await redisService.blacklistToken(token, 60 * 60 * 2);
    }
  }

  /**
   * Check if a token is blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      return await redisService.isTokenBlacklisted(token);
    } catch (error) {
      console.error("Error checking token blacklist:", error);
      // Fail safely - assume not blacklisted to avoid blocking valid users
      return false;
    }
  }

  /**
   * Blacklist all tokens for a specific user (useful for logout from all devices)
   */
  async blacklistAllUserTokens(userId: string): Promise<void> {
    // Since we can't enumerate all active tokens for a user,
    // we'll use a different approach: store a "user blacklist timestamp"
    // Any token issued before this timestamp is considered invalid
    const timestamp = Math.floor(Date.now() / 1000);
    const key = `user_blacklist:${userId}`;

    // Store for 2 hours (max token lifetime)
    await redisService
      .getClient()
      .setex(key, 60 * 60 * 2, timestamp.toString());
  }

  /**
   * Check if all user tokens should be considered blacklisted
   */
  async areUserTokensBlacklisted(
    userId: string,
    tokenIssuedAt: number
  ): Promise<boolean> {
    try {
      const key = `user_blacklist:${userId}`;
      const blacklistTimestamp = await redisService.getClient().get(key);

      if (!blacklistTimestamp) {
        return false;
      }

      const blacklistTime = parseInt(blacklistTimestamp, 10);
      return tokenIssuedAt < blacklistTime;
    } catch (error) {
      console.error("Error checking user token blacklist:", error);
      return false;
    }
  }
}

const tokenBlacklistService = new TokenBlacklistService();
export default tokenBlacklistService;
