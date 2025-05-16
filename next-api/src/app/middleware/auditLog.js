import prisma from "../../../prisma/client";

export function auditMiddleware(getCurrentUserId) {
  return async (params, next) => {
    const auditModels = ["asset_information", "caseinformation"];

    const isTargetModel = auditModels.includes(params.model?.toLowerCase());
    const isMutation = ["create", "update", "delete"].includes(params.action);

    if (!isTargetModel || !isMutation) {
      return next(params);
    }

    const userId = getCurrentUserId();

    let oldData = null;
    if (params.action === "update" || params.action === "delete") {
      oldData = await prisma[params.model].findUnique({
        where: params.args.where,
      });
    }

    const result = await next(params);

    const newData = params.action === "delete" ? null : result;

    await prisma.auditLog.create({
      data: {
        model: params.model,
        operation: params.action,
        userId: userId || null,
        dataOld: oldData,
        dataNew: newData,
      },
    });

    return result;
  };
}
