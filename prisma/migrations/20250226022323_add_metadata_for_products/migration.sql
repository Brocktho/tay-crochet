/*
  Warnings:

  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductPreviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductVariants` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("description", "id", "title") SELECT "description", "id", "title" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_ProductPreviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductPreviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductPreviews" ("description", "id", "imagePath", "productId") SELECT "description", "id", "imagePath", "productId" FROM "ProductPreviews";
DROP TABLE "ProductPreviews";
ALTER TABLE "new_ProductPreviews" RENAME TO "ProductPreviews";
CREATE TABLE "new_ProductVariants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductVariants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductVariants" ("id", "imagePath", "isDefault", "price", "productId", "quantity", "title") SELECT "id", "imagePath", "isDefault", "price", "productId", "quantity", "title" FROM "ProductVariants";
DROP TABLE "ProductVariants";
ALTER TABLE "new_ProductVariants" RENAME TO "ProductVariants";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
