CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    display_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    bio TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,

    owner_id INTEGER NOT NULL,

    contact_id INTEGER NOT NULL,

    nickname VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (contact_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE(owner_id, contact_id),

    CHECK (owner_id <> contact_id)
);

CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,

    conv_type VARCHAR(20)
        NOT NULL
        CHECK (conv_type IN ('private', 'group'))
        DEFAULT 'private',

    group_name VARCHAR(255),

    created_by INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE participants (
    id SERIAL PRIMARY KEY,

    conversation_id INTEGER NOT NULL,

    user_id INTEGER NOT NULL,

    role VARCHAR(20)
        NOT NULL
        CHECK (role IN ('admin', 'member'))
        DEFAULT 'member',

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE(conversation_id, user_id)
);

