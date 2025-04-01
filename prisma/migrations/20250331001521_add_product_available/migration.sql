/*
  Warnings:

  - You are about to drop the `ProductVariants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `productId` on the `ProductPreviews` table. All the data in the column will be lost.
  - Added the required column `productVariantId` to the `ProductPreviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductVariants";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "quantity" INTEGER NOT NULL,
    "available" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductPreviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductPreviews_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductPreviews" ("createdAt", "description", "id", "imagePath", "updatedAt") SELECT "createdAt", "description", "id", "imagePath", "updatedAt" FROM "ProductPreviews";
DROP TABLE "ProductPreviews";
ALTER TABLE "new_ProductPreviews" RENAME TO "ProductPreviews";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
