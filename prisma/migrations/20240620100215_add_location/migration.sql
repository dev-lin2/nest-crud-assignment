-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "building_name" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "location_number" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "parent_location_id" INTEGER,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_parent_location_id_fkey" FOREIGN KEY ("parent_location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
