create table ers_user_roles (
    role_id serial,
    role_name varchar(25) not null,

    constraint role_id_pk primary key (role_id)
);

create table ers_users (
    ers_user_id serial,
    username varchar(25) unique not null,
    password varchar(256) not null,
    first_name varchar(25) not null,
    last_name varchar(25) not null,
    email varchar(256) not null,
    user_role_id int not null,

    constraint ers_user_id_pk primary key (ers_user_id),
    constraint user_role_id_fk foreign key (user_role_id) references ers_user_roles
);

create table ers_reimb_types (
    reimb_type_id serial,
    reimb_type varchar(10) not null,

    constraint reimb_type_id primary key (reimb_type_id)
);

create table ers_reimb_statuses (
    reimb_status_id serial,
    reimb_status varchar(10) not null,

    constraint reimb_status_id primary key (reimb_status_id)
);

create table ers_reimbursements (
    reimb_id serial,
    amount decimal(6, 2) not null,
    submitted timestamp not null,
    resolved timestamp not null,
    description text not null,
    reciept BYTEA,
    author_id int not null,
    resolver_id int,
    reimb_status_id int not null,
    reimb_type_id int not null,

    constraint reimb_id_pk primary key (reimb_id),
    constraint reimb_status_id_fk foreign key (reimb_status_id) references ers_reimb_statuses,
    constraint reimb_type_id_fk foreign key (reimb_type_id) references ers_reimb_types

);

--
truncate ers_users restart identity cascade

truncate ers_user_roles restart identity cascade

truncate ers_reimb_types restart identity cascade

truncate ers_reimb_statuses restart identity cascade

truncate ers_reimbursements restart identity cascade
--

insert into
    ers_user_roles (role_name)
values
    ('admin'),
    ('finance manager'),
    ('employee');
--

insert into
    ers_users (username, password, first_name, last_name, email, user_role_id)
values
    ('admin', 'password', 'Bob', 'Bobbert', 'bob@admin.com', 1),
    ('manager', 'password', 'Cob', 'Cobbert', 'cob@manager.com', 2),
    ('employee', 'password', 'Rob', 'Robbert', 'rob@employee.com', 3);
--

SELECT
    *
FROM
    ers_users
    INNER JOIN ers_user_roles ON ers_users.user_role_id = ers_user_roles.role_id;
--

insert into
    ers_reimb_types (reimb_type)
values
    ('lodging'),
    ('travel'),
    ('food'),
    ('other');
--

insert into
    ers_reimb_statuses (reimb_status)
values
    ('pending'),
    ('approved'),
    ('denied');
--

insert into
    ers_reimbursements (amount, submitted, resolved, description, reciept, author_id, resolver_id, reimb_status_id, reimb_type_id)
values
    (100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'This is a reimb description', 'This is a reciept picture', 2, 1, 1, 3);
    (125, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'This is a reimb description', 'This is a reciept picture', 1, 1, 2, 4);
    (50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'This is a reimb description', 'This is a reciept picture', 3, 1, 3, 1);
    (62, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'This is a reimb description', 'This is a reciept picture', 1, 1, 1, 2);

--

commit;

SELECT
    *
FROM
    ers_reimbursements
    INNER JOIN ers_reimb_types ON ers_users.reimb_type_id = ers_reimb_types.reimb_type_id
    INNER JOIN ers_reimb_statuses ON ers_users.reimb_status_id = ers_reimb_statuses.reimb_status_id