/*
  Warnings:

  - A unique constraint covering the columns `[senderUserId,receiverUserId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receiverUserId,senderUserId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_senderUserId_receiverUserId_key" ON "Conversation"("senderUserId", "receiverUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_receiverUserId_senderUserId_key" ON "Conversation"("receiverUserId", "senderUserId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_receiverUserId_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
