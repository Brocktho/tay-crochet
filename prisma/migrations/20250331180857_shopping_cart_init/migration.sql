-- CreateTable
CREATE TABLE "ShoppingCart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "token" TEXT,
    "finished" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ShoppingCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shoppingCartId" TEXT NOT NULL,
    "shippingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Purchase_shippingId_fkey" FOREIGN KEY ("shippingId") REFERENCES "ShippingAddress" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Purchase_shoppingCartId_fkey" FOREIGN KEY ("shoppingCartId") REFERENCES "ShoppingCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "street1" TEXT NOT NULL,
    "street2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductPurchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "shoppingCartId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductPurchase_shoppingCartId_fkey" FOREIGN KEY ("shoppingCartId") REFERENCES "ShoppingCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductPurchase_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ShoppingCart_userId_idx" ON "ShoppingCart"("userId");

-- CreateIndex
CREATE INDEX "ShoppingCart_token_idx" ON "ShoppingCart"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_shoppingCartId_key" ON "Purchase"("shoppingCartId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_shippingId_key" ON "Purchase"("shippingId");

-- CreateIndex
CREATE INDEX "ProductPurchase_shoppingCartId_idx" ON "ProductPurchase"("shoppingCartId");

-- CreateIndex
CREATE INDEX "ProductPreviews_productVariantId_idx" ON "ProductPreviews"("productVariantId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
