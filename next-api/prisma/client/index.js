const { PrismaClient } = require("@prisma/client");
import { auditMiddleware } from "@/app/middleware/auditLog";
import { getTokenUserId } from "@/app/middleware/auth";

let userIdProvider = () => null;

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "production"
    ? ["error", "warn"]
    : ["query", "error", "info", "warn"],
});



prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

prisma.$use(auditMiddleware(() => userIdProvider?.()));

export function setUserIdProvider(fn) {
  userIdProvider = fn;
}


export default prisma;
