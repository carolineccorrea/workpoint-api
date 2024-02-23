-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "neighborhood" TEXT;

-- CreateTable
CREATE TABLE "service_orders" (
    "id" SERIAL NOT NULL,
    "equipment" TEXT NOT NULL,
    "accessories" TEXT,
    "complaint" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "serialNumber" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "underWarranty" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "service_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
