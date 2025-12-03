export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  database: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://ordino:ordino@localhost:5432/ordino_dev",
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "change-me-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  magicLink: {
    expiresIn: process.env.MAGIC_LINK_EXPIRES_IN || "30m",
  },
};
