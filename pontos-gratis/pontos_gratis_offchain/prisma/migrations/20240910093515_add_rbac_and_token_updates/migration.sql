/*
  Warnings:

  - You are about to drop the column `customerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserImage` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserImage" DROP CONSTRAINT "UserImage_userId_fkey";

-- DropIndex
DROP INDEX "User_customerId_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "customerId",
DROP COLUMN "username",
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- DropTable
DROP TABLE "UserImage";

-- CreateTable
CREATE TABLE "EconomicGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EconomicGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "economicGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NfceReceipt" (
    "id" TEXT NOT NULL,
    "accessKey" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "discount" INTEGER,
    "totalPaid" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NfceReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "quantity" DOUBLE PRECISION,
    "unit" TEXT,
    "unitPrice" INTEGER,
    "totalPrice" INTEGER,
    "receiptId" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER,
    "mintAddress" TEXT,
    "totalSupply" DOUBLE PRECISION,
    "mintAuthority" TEXT,
    "freezeAuthority" TEXT,
    "burnAuthority" TEXT,
    "onChain" BOOLEAN NOT NULL DEFAULT false,
    "uri" TEXT,
    "image" TEXT,
    "description" TEXT,
    "sellerFeeBasisPoints" INTEGER,
    "updateAuthority" TEXT,
    "creators" JSONB,
    "collection" TEXT,
    "attributes" JSONB,
    "economicGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OffChainTransaction" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OffChainTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_cnpj_key" ON "Business"("cnpj");

-- CreateIndex
CREATE INDEX "Business_economicGroupId_idx" ON "Business"("economicGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "NfceReceipt_accessKey_key" ON "NfceReceipt"("accessKey");

-- CreateIndex
CREATE INDEX "NfceReceipt_businessId_idx" ON "NfceReceipt"("businessId");

-- CreateIndex
CREATE INDEX "NfceReceipt_userId_idx" ON "NfceReceipt"("userId");

-- CreateIndex
CREATE INDEX "Token_economicGroupId_idx" ON "Token"("economicGroupId");

-- CreateIndex
CREATE INDEX "OffChainTransaction_tokenId_idx" ON "OffChainTransaction"("tokenId");

-- CreateIndex
CREATE INDEX "OffChainTransaction_userId_idx" ON "OffChainTransaction"("userId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_economicGroupId_fkey" FOREIGN KEY ("economicGroupId") REFERENCES "EconomicGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NfceReceipt" ADD CONSTRAINT "NfceReceipt_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NfceReceipt" ADD CONSTRAINT "NfceReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "NfceReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_economicGroupId_fkey" FOREIGN KEY ("economicGroupId") REFERENCES "EconomicGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffChainTransaction" ADD CONSTRAINT "OffChainTransaction_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffChainTransaction" ADD CONSTRAINT "OffChainTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffChainTransaction" ADD CONSTRAINT "OffChainTransaction_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "NfceReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
