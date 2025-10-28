-- Drop columns
ALTER TABLE "persona" DROP COLUMN "ci";
ALTER TABLE "persona" DROP COLUMN "telefono";

-- Add new column
ALTER TABLE "persona" ADD COLUMN "confirmar_password" VARCHAR(100) NOT NULL;
