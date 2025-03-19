-- noinspection SqlNoDataSourceInspectionForFile

# --- !Ups

create table people (
                        id                            bigint auto_increment not null,
                        username                      varchar(255) not null unique,
                        password                      varchar(255) not null,
                        created_time                  datetime(6) not null,
                        updated_time                  datetime(6) not null,
                        constraint pk_people primary key (id)
);

create table chat (
                      id                            bigint auto_increment not null,
                      user_id                       bigint not null,
                      message                       varchar(255),
                      created_time                  datetime(6) not null,
                      updated_time                  datetime(6) not null,
                      constraint pk_chat primary key (id),
                      constraint fk_chat_user foreign key (user_id) references people(id)
);

CREATE TABLE quiz_attempt (
                        id BIGINT AUTO_INCREMENT NOT NULL,
                        user_id BIGINT NOT NULL,
                        quiz_type VARCHAR(50) NOT NULL,
                        question TEXT NOT NULL,
                        user_answer VARCHAR(255),
                        correct_answer VARCHAR(255) NOT NULL,
                        is_correct BOOLEAN NOT NULL,
                        attempt_time DATETIME(6) NOT NULL,
                        duration INT, -- duration in seconds or milliseconds
                        PRIMARY KEY (id),
                        CONSTRAINT fk_quiz_user FOREIGN KEY (user_id) REFERENCES people(id)
);

-- !Downs

drop table if exists quiz_attempt;

drop table if exists chat;

drop table if exists people;
