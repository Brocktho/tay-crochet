/*
  Warnings:

  - Added the required column `updatedAt` to the `ProductTags` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductTags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ProductTags" ("id", "type") SELECT "id", "type" FROM "ProductTags";
DROP TABLE "ProductTags";
ALTER TABLE "new_ProductTags" RENAME TO "ProductTags";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
