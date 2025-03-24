/*
  Warnings:

  - Added the required column `code` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Survey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "templateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Survey_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "SurveyTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
-- Mevcut kayıtlar için her kayıda ID'lerini kod olarak atayalım
INSERT INTO "new_Survey" ("createdAt", "description", "id", "templateId", "title", "updatedAt", "code") SELECT "createdAt", "description", "id", "templateId", "title", "updatedAt", "id" FROM "Survey";
DROP TABLE "Survey";
ALTER TABLE "new_Survey" RENAME TO "Survey";
CREATE INDEX "Survey_code_idx" ON "Survey"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
