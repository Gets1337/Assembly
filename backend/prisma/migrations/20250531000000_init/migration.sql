-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "full_name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL DEFAULT 1,

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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_method" TEXT NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderHistory" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "current_status_id" INTEGER NOT NULL,
    "new_status_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_url" TEXT,
    "stock_quantity" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInOrder" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageCell" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInCells" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "cell_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInCells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserve" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Reserve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OrderStatus_name_key" ON "OrderStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Info_key_key" ON "Info"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_id_key" ON "Cart"("user_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_current_status_id_fkey" FOREIGN KEY ("current_status_id") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_new_status_id_fkey" FOREIGN KEY ("new_status_id") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInOrder" ADD CONSTRAINT "ProductInOrder_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInOrder" ADD CONSTRAINT "ProductInOrder_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInCells" ADD CONSTRAINT "ProductInCells_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "StorageCell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInCells" ADD CONSTRAINT "ProductInCells_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert initial data
INSERT INTO "Role" ("name") VALUES ('admin');
INSERT INTO "Role" ("name") VALUES ('worker');
INSERT INTO "Role" ("name") VALUES ('user');

INSERT INTO "OrderStatus" ("name") VALUES ('Created');
INSERT INTO "OrderStatus" ("name") VALUES ('Worked');
INSERT INTO "OrderStatus" ("name") VALUES ('Ready');
INSERT INTO "OrderStatus" ("name") VALUES ('Issued');

-- Create update_timestamp function
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER Order_timestamp BEFORE UPDATE ON "Order"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER Product_timestamp BEFORE UPDATE ON "Product"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER ProductInOrder_timestamp BEFORE UPDATE ON "ProductInOrder"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER ProductInCells_timestamp BEFORE UPDATE ON "ProductInCells"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER Reserve_timestamp BEFORE UPDATE ON "Reserve"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER StorageCell_timestamp BEFORE UPDATE ON "StorageCell"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER Cart_timestamp BEFORE UPDATE ON "Cart"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER CartItem_timestamp BEFORE UPDATE ON "CartItem"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp(); 

--Пароль (adminBB123, workerBB123, userBB123)

INSERT INTO "User" (login, password, full_name, birth_date, role_id) VALUES
  ('admin', '$2b$10$rkJdartAj1HQBH8jx30.7uREFyenBaXs0vOBCHRGDAO3UCEITe1jS', 'Admin', '1990-01-01', (SELECT id FROM "Role" WHERE name = 'admin')),
  ('worker', '$2b$10$pfvc3qkKtZH5eOclsFnqFuCRfnw0ZVWg2vD8KFbUfuJPXk28BSG4O', 'Worker', '1992-02-02', (SELECT id FROM "Role" WHERE name = 'worker')),
  ('user', '$2b$10$lRvmLL1uG.s4zaVQsK16HujZ4L9vaNWzMm3ACkSX6qVk6ZYT73ap6', 'User', '1995-05-05', (SELECT id FROM "Role" WHERE name = 'user'));

INSERT INTO "Product" (name, description, price, stock_quantity, image_url, created_at, updated_at) VALUES
  ('iPhone 13 Pro', 'https://mtscdn.ru/upload/iblock/28a/7000_5394.png', 999.99, 15, 'https://mtscdn.ru/upload/iblock/28a/7000_5394.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Samsung 4K TV', '55-inch 4K Smart TV', 699.99, 5, 'https://online-samsung.ru/sites/default/files/styles/product_full/public/2024-12/UE65CU7100UXRU_14.png.webp?itok=nJ8AvK-v', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('PlayStation 5', 'Next-gen gaming console', 499.99, 8, 'https://istudio-shop.ru/upload/iblock/8c6/o3l8545wmk8ti1kqbw87y1n2648soy11.webp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('AirPods Pro', 'Wireless noise-cancelling earbuds', 249.99, 20, 'https://ishop124.ru/wp-content/uploads/2023/10/apple-airpods-pro-22023-1.jpeg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);