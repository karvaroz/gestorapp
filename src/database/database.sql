CREATE DATABASE gestorapp;

USE gestorapp;

CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR (50) NOT NULL,
    nombre VARCHAR (50) NOT NULL,
    email VARCHAR (50) NOT NULL,
    telefono INT (10) NOT NULL,
    contrasena VARCHAR (250) NOT NULL
);

CREATE TABLE inventario (
    codigo INT (90) NOT NULL PRIMARY KEY,
    producto VARCHAR (90) NOT NULL,
    cantidad INT (90) NOT NULL,
    precio INT (90) NOT NULL,
    nit_proveedor INT (90) NOT NULL 
);

CREATE TABLE proveedores (
    nit_proveedor INT (90) NOT NULL PRIMARY KEY,
    nombre VARCHAR (90) NOT NULL,
    codigo INT (90) NOT NULL,
    telefono VARCHAR (90) NOT NULL,
    email VARCHAR (90) NOT NULL,
    dias_descuento INT (10) NOT NULL
);

CREATE TABLE cuentas_proveedores (
    id_factura INT (90) NOT NULL PRIMARY KEY,
    nit_proveedor INT (90) NOT NULL,
    dias_descuento INT (90) NOT NULL,
    total INT (90) NOT NULL,
    estado VARCHAR (90) NOT NULL,
    fecha_lim DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE ventas_diarias (
    id INT (90) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    total_venta INT (90) NOT NULL,
    total_gasto INT (90) NOT NULL,
    total_ganancia INT (90),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
