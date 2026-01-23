// lib/withRequestContext.js
import jwt from "jsonwebtoken";
import { requestContext } from "@/lib/requestContext";

export function withRequestContext(handler) {
  return async (request, ...args) => {
    let userId = null;

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e){
        console.error(e)
      }
    }

    return requestContext.run({ userId }, () =>
      handler(request, ...args)
    );
  };
}
