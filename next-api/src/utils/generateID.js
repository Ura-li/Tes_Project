import prisma from "../../prisma/client";

export async function generateID(prefix, modelName, idField) {
    const count = await prisma[modelName].count();
    const paddedNumber = String(count + 5).padStart(4, "0");
    console.log(`GeneratedID : ${prefix}${paddedNumber}`)
    return `${prefix}${paddedNumber}`;
  }
  