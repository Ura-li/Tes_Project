/*
  Warnings:

  - The primary key for the `quotationtable` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- drop FK
ALTER TABLE quotation_lineitem
  DROP FOREIGN KEY quotation_lineitem_QuotationNo_fkey;

ALTER TABLE invoicetable
  DROP FOREIGN KEY invoicetable_QuotationNo_fkey;

-- modify parent
ALTER TABLE quotationtable
  MODIFY QuotationNo VARCHAR(255) NOT NULL;

-- modify child to match
ALTER TABLE quotation_lineitem
  MODIFY QuotationNo VARCHAR(255) NOT NULL;
  
ALTER TABLE invoicetable
  MODIFY QuotationNo VARCHAR(255) NOT NULL;

-- re-add FK
ALTER TABLE quotation_lineitem
  ADD CONSTRAINT quotation_lineitem_QuotationNo_fkey
  FOREIGN KEY (QuotationNo)
  REFERENCES quotationtable (QuotationNo)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE invoicetable
  ADD CONSTRAINT invoice_QuotationNo_fkey
  FOREIGN KEY (QuotationNo)
  REFERENCES quotationtable (QuotationNo)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
