-- AlterTable
ALTER TABLE `materialorderlineitems` ADD COLUMN `GoodReturnReason` ENUM('AdminIssue', 'CIDRejected', 'ComplexIssue', 'CustomerCancelRepair', 'OnsiteRemoteArea', 'OtherReason', 'WrongAnalysisCCC', 'WrongAnalysisCE', 'WrongOrderCE') NULL;
