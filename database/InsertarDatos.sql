INSERT INTO roles (name)
VALUES ('Administrador'),
  ('Coordinador');
INSERT INTO users (name, dni, password, role_id)
VALUES ('Administrador', 12345678, 'admin123', 1);