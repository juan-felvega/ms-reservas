
-- Ejecutar dentro de reservas_db
SET NAMES utf8mb4;

CREATE TABLE reservas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  codigo         VARCHAR(20) NOT NULL UNIQUE,
  huesped        VARCHAR(100) NOT NULL,
  fecha_entrada  DATE NOT NULL,
  fecha_salida   DATE NOT NULL,
  personas       INT NOT NULL,
  agencia_id     INT NOT NULL
);

INSERT INTO reservas
  (codigo, huesped, fecha_entrada, fecha_salida, personas, agencia_id)
VALUES
  ('RES-001', 'Ana Torres',  '2026-12-01', '2026-12-05', 2, 1),
  ('RES-002', 'Carlos Ruiz', '2026-12-10', '2026-12-12', 1, 2),
  ('RES-003', 'Ana Torres',  '2026-12-20', '2026-12-27', 4, 4);