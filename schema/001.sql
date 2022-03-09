DROP TABLE IF EXISTS auth;

CREATE TABLE IF NOT EXISTS auth(
    auth_id int(10) NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY(auth_id)
);
