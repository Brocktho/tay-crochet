-- CreateTable
CREATE TABLE "Links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "route" TEXT NOT NULL,
    "display" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductTags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToProductTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProductToProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductToProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductTags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductTags_AB_unique" ON "_ProductToProductTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductTags_B_index" ON "_ProductToProductTags"("B");
