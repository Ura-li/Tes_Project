export function mapMaterialOrdersToQuotationItems(caseDetails: any) {
  const workorders = caseDetails?.workorder || [];
  const allItems: {
    lineItemId: string | number;
    moid: string | number;
    woid: string | number;
    partNumber: string;
    description: string;
    quantity: number | string;
    price: string;
    partApproved: string; // "yes" | "no" | ""
  }[] = [];

  workorders.forEach((wo: any) => {
    (wo.materialorder || []).forEach((mo: any) => {
      (mo.materialorderlineitems || []).forEach((line: any) => {
        const quotationEntry =
          Array.isArray(line.quotation_lineitem) &&
          line.quotation_lineitem.length > 0
            ? line.quotation_lineitem[0]
            : undefined;

        const initialApproved = quotationEntry?.Approved;
        const approvedValue =
          initialApproved === undefined || initialApproved === null
            ? ""
            : initialApproved
            ? "yes"
            : "no";

        const linePrice = quotationEntry?.Price ?? line.Price ?? "";

        allItems.push({
          lineItemId: line.LineItemID,
          moid: mo.MOID,
          woid: wo.WOID,
          partNumber: line.PartNumber,
          description: line.Description,
          quantity: line.Quantity ?? "",
          price:
            linePrice === null || linePrice === undefined
              ? ""
              : String(linePrice),
          partApproved: approvedValue,
        });
      });
    });
  });

  return allItems;
}
