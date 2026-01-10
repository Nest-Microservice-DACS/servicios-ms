-- CreateTable
CREATE TABLE "Servicio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "duracion" INTEGER NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Servicio_nombre_key" ON "Servicio"("nombre");
