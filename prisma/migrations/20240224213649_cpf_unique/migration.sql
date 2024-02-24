/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cpf` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "cpf" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_cpf_key" ON "customers"("cpf");
