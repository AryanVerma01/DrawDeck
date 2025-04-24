-- DropForeignKey
ALTER TABLE "Shape" DROP CONSTRAINT "Shape_fileId_fkey";

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
