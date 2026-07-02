
create table users (
    id serial primary key,
    username varchar(255) not null unique,
    email varchar(255) not null unique, 
    password varchar(255) not null,
    bio text,
    created_at timestamp default current_timestamp,
    last_seen timestamp default current_timestamp
);

create table conversations(
    id serial primary key, 
    conv_type VARCHAR(20) NOT NULL DEFAULT 'private',
    group_name varchar(250),
    created_by integer not null,
    created_at timestamp default current_timestamp,
    foreign key(created_by) references users(id)
);

create table participants(
    id serial primary key, 
    conversation_id integer not null,
    user_id integer not null, 
    role varchar(50) not null default 'member',
    joined_at timestamp default current_timestamp,
    foreign key(conversation_id) references conversations(id) on delete cascade,
    foreign key(user_id) references users(id) on delete cascade,
    unique(conversation_id, user_id)
);

create table messages(
    id serial primary key, 
    conversation_id integer not null,
    sender_id integer not null,
    content text not null,
    created_at timestamp default current_timestamp,
    foreign key(conversation_id) references conversations(id) on delete cascade,
    foreign key(sender_id) references users(id) on delete cascade
);
