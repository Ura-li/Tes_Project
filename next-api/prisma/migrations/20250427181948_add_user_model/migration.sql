-- CreateTable
CREATE TABLE `User` (
    `IDUser` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(255) NOT NULL,
    `Username` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `Name` VARCHAR(255) NOT NULL,
    `Role` VARCHAR(50) NOT NULL DEFAULT 'user',
    `ProfilePhoto` VARCHAR(500) NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_Email_key`(`Email`),
    UNIQUE INDEX `User_Username_key`(`Username`),
    PRIMARY KEY (`IDUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
