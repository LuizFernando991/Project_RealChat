/*
  Warnings:

  - A unique constraint covering the columns `[senderUserId,receiverUserId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receiverUserId,senderUserId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[senderUserId,receiverUserId]` on the table `FriendshipRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friendship_senderUserId_receiverUserId_key" ON "Friendship"("senderUserId", "receiverUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_receiverUserId_senderUserId_key" ON "Friendship"("receiverUserId", "senderUserId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendshipRequest_senderUserId_receiverUserId_key" ON "FriendshipRequest"("senderUserId", "receiverUserId");
