-- db/schema.sql — base de datos de ms-agencias
SET NAMES utf8mb4;

CREATE TABLE agencias (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  nombre_agencia       VARCHAR(100) NOT NULL,
  ciudad               VARCHAR(60) NOT NULL,
  estado_convenio      VARCHAR(20) NOT NULL
);

INSERT INTO agencias (nombre_agencia, ciudad, estado_convenio) VALUES
  ('Viajes Pacífico', 'Cali', 'activo'),
  ('Destinos Andinos', 'Bogotá', 'activo'),
  ('Turismo Express', 'Medellín', 'suspendido'),
  ('Caribe Tours', 'Cartagena', 'activo');
