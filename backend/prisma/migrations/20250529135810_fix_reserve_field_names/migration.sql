/*
  Warnings:

  - You are about to drop the column `cartId` on the `Reserve` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Reserve` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reserve" DROP CONSTRAINT "Reserve_cartId_fkey";

-- AlterTable
ALTER TABLE "Reserve" DROP COLUMN "cartId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
