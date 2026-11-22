-- db/schema.sql · ms-reservas
-- Se ejecuta dentro de reservas_db:  USE reservas_db;  y luego  SOURCE db/schema.sql;
SET NAMES utf8mb4;              -- para que las tildes y la ñ se guarden bien

CREATE TABLE reservas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  codigo         VARCHAR(20)  NOT NULL UNIQUE,   -- regla: codigo único (409)
  huesped        VARCHAR(100) NOT NULL,
  fecha_entrada  DATE         NOT NULL,
  fecha_salida   DATE         NOT NULL,          -- debe ser posterior a fecha_entrada (400)
  personas       INT          NOT NULL           -- entero mayor que 0
);

INSERT INTO reservas (codigo, huesped, fecha_entrada, fecha_salida, personas) VALUES
  ('RES-001', 'Ana Torres',   '2026-12-01', '2026-12-05', 2),
  ('RES-002', 'Carlos Ruiz',  '2026-12-10', '2026-12-12', 1),
  ('RES-003', 'Ana Torres',   '2026-12-20', '2026-12-27', 4);
