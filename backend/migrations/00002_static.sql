-- +goose Up

INSERT into `user` (name, email, password, role) VALUES ('ketan', 'ketan@gmail.com', 'ketan', 'admin');

