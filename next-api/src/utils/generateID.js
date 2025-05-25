import prisma from "../../prisma/client";

export async function generateID(prefix, modelName, idField) {
  // Cari ID terakhir berdasarkan urutan DESC
  const lastRecord = await prisma[modelName].findFirst({
    where: {
      [idField]: {
        startsWith: prefix,
      },
    },
    orderBy: {
      [idField]: "desc",
    },
    select: {
      [idField]: true,
    },
  });

  let nextNumber = 1;

  if (lastRecord) {
    // Ambil angka dari ID terakhir, misalnya dari "C-0010" ambil 10
    const lastNumber = parseInt(lastRecord[idField].replace(prefix, "").replace("-", ""), 10);
    nextNumber = lastNumber + 1;
  }

  const paddedNumber = String(nextNumber).padStart(4, "0");
  const newID = `${prefix}${paddedNumber}`;

  console.log(`GeneratedID : ${newID}`);
  return newID;
}
