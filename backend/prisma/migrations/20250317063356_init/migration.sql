-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statusId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderHistory" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "currentStatusId" INTEGER NOT NULL,
    "newStatusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "stockQuantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInOrder" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageCell" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductinCells" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "cellId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductinCells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserve" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OrderStatus_name_key" ON "OrderStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Info_key_key" ON "Info"("key");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_currentStatusId_fkey" FOREIGN KEY ("currentStatusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_newStatusId_fkey" FOREIGN KEY ("newStatusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInOrder" ADD CONSTRAINT "ProductInOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInOrder" ADD CONSTRAINT "ProductInOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductinCells" ADD CONSTRAINT "ProductinCells_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductinCells" ADD CONSTRAINT "ProductinCells_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "StorageCell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

Insert INTO "Role" ("name") VALUES ('admin');
INSERT INTO "Role" ("name") VALUES ('worker');
INSERT INTO "Role" ("name") VALUES ('user');

ALTER TABLE "User" ADD COLUMN "role_id" INT NOT NULL DEFAULT 1;

INSERT INTO "OrderStatus" ("name") VALUES ('Created');
INSERT INTO "OrderStatus" ("name") VALUES ('Worked');
INSERT INTO "OrderStatus" ("name") VALUES ('Ready');
INSERT INTO "OrderStatus" ("name") VALUES ('Issued');

BEGIN;
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
    BEGIN
        NEW.updatedAt = now();
            RETURN NEW;
    END;
$$ language 'plpgsql';
COMMIT;

CREATE TRIGGER Order_timestamp BEFORE UPDATE ON "Order"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER Product_timestamp BEFORE UPDATE ON "Product"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER ProductInOrder_timestamp BEFORE UPDATE ON "ProductInOrder"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER ProductinCells_timestamp BEFORE UPDATE ON "ProductinCells"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER Reserve_timestamp BEFORE UPDATE ON "Reserve"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER StorageCell_timestamp BEFORE UPDATE ON "StorageCell"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();


