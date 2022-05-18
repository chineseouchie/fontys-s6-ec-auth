CREATE TABLE IF NOT EXISTS auth(
    auth_id int(10) NOT NULL AUTO_INCREMENT,
    uuid varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY(auth_id)
);

CREATE TABLE IF NOT EXISTS user(
    user_id int(10) NOT NULL AUTO_INCREMENT,
    auth_id int(10) NOT NULL,
    user_uuid varchar(255) NOT NULL,
    firstname varchar(255) NOT NULL,
    lastname varchar(255) NOT NULL,
    street varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    province varchar(255) NOT NULL,
    country varchar(255) NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS role(
    role_id int(10) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY(role_id)
);

CREATE TABLE IF NOT EXISTS user_role(
    user_role_id int(10) NOT NULL AUTO_INCREMENT,
    user_id int(10) NOT NULL,
    role_id int(10) NOT NULL,
    PRIMARY KEY(user_role_id)
);

INSERT IGNORE INTO role(name) VALUES("ADMIN"),("EMPLOYEE"),("USER")
