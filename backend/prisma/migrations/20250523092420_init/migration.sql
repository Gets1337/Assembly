/*
  Warnings:

  - Added the required column `cartId` to the `Reserve` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserve" ADD COLUMN     "cartId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
