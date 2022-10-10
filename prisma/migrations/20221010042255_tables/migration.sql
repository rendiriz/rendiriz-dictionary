-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alphabet" TEXT,
    "translate" TEXT NOT NULL,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "cuid" TEXT NOT NULL,
    "cat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "muid" TEXT,
    "mat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Informal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alphabet" TEXT,
    "translate" TEXT NOT NULL,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "cuid" TEXT NOT NULL,
    "cat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "muid" TEXT,
    "mat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Informal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slang" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alphabet" TEXT,
    "translate" TEXT NOT NULL,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "cuid" TEXT NOT NULL,
    "cat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "muid" TEXT,
    "mat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sentence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alphabet" TEXT,
    "translate" TEXT NOT NULL,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "cuid" TEXT NOT NULL,
    "cat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "muid" TEXT,
    "mat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sentence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_slug_key" ON "Word"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Informal_slug_key" ON "Informal"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Slang_slug_key" ON "Slang"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Sentence_slug_key" ON "Sentence"("slug");

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Informal" ADD CONSTRAINT "Informal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Informal" ADD CONSTRAINT "Informal_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slang" ADD CONSTRAINT "Slang_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slang" ADD CONSTRAINT "Slang_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
