-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "cnpj" TEXT,
ADD COLUMN     "cpf" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
