const { PrismaClient } = require("@prisma/client");
import { auditMiddleware } from "@/app/middleware/auditLog";
import { getTokenUserId } from "@/app/middleware/auth";

let userIdProvider = () => null;

const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout", //change to event if want to activate below 
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
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
