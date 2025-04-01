/*
  Warnings:

  - Added the required column `imageAltText` to the `ProductPreviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageAltText` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "id", "isDeleted", "title", "updatedAt") SELECT "categoryId", "createdAt", "description", "id", "isDeleted", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_ProductPreviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "imageAltText" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ProductPreviews_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductPreviews" ("createdAt", "description", "id", "imagePath", "isDeleted", "productVariantId", "updatedAt") SELECT "createdAt", "description", "id", "imagePath", "isDeleted", "productVariantId", "updatedAt" FROM "ProductPreviews";
DROP TABLE "ProductPreviews";
ALTER TABLE "new_ProductPreviews" RENAME TO "ProductPreviews";
CREATE INDEX "ProductPreviews_productVariantId_idx" ON "ProductPreviews"("productVariantId");
CREATE TABLE "new_ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "imageAltText" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "quantity" INTEGER NOT NULL,
    "available" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductVariant" ("available", "createdAt", "id", "imagePath", "isDefault", "isDeleted", "price", "productId", "quantity", "title", "updatedAt") SELECT "available", "createdAt", "id", "imagePath", "isDefault", "isDeleted", "price", "productId", "quantity", "title", "updatedAt" FROM "ProductVariant";
DROP TABLE "ProductVariant";
ALTER TABLE "new_ProductVariant" RENAME TO "ProductVariant";
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
