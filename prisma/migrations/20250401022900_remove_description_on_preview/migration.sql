/*
  Warnings:

  - You are about to drop the column `description` on the `ProductPreviews` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductPreviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imagePath" TEXT NOT NULL,
    "imageAltText" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ProductPreviews_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductPreviews" ("createdAt", "id", "imageAltText", "imagePath", "isDeleted", "productVariantId", "updatedAt") SELECT "createdAt", "id", "imageAltText", "imagePath", "isDeleted", "productVariantId", "updatedAt" FROM "ProductPreviews";
DROP TABLE "ProductPreviews";
ALTER TABLE "new_ProductPreviews" RENAME TO "ProductPreviews";
CREATE INDEX "ProductPreviews_productVariantId_idx" ON "ProductPreviews"("productVariantId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
