/*
  Warnings:

  - Made the column `description` on table `service_orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "service_orders" ALTER COLUMN "description" SET NOT NULL;
