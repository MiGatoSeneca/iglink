CREATE TABLE users (
    UID uniqueidentifier DEFAULT (newid()) NOT NULL,
    username varchar(255) NOT NULL,
    active bit DEFAULT (0) NOT NULL,
    created datetime DEFAULT (getdate()),
    lastUpdate datetime DEFAULT (getdate()),
    PRIMARY KEY (UID)
);

CREATE TABLE userActives (
    UID uniqueidentifier DEFAULT (newid()) NOT NULL,
    username varchar(255) NOT NULL,
    active bit DEFAULT (0) NOT NULL,
    created datetime DEFAULT (getdate()),
    PRIMARY KEY (UID)
);

CREATE TABLE bottags_tags (
    BTID uniqueidentifier DEFAULT (newid()) NOT NULL,
    tag varchar(255) NOT NULL,
    PRIMARY KEY (BTID)
);

CREATE TABLE bottags_users (
    BUID uniqueidentifier DEFAULT (newid()) NOT NULL,
    username varchar(255) NOT NULL,
    fullName varchar(255),
    follows int DEFAULT ((0)),
    followed int DEFAULT ((0)),
    likesAverage int DEFAULT ((0)),
    nodesCount int DEFAULT ((0)),
    nodesUrlAverage int DEFAULT ((0)),
    email varchar(255),
    url varchar(255),
    created datetime DEFAULT (getdate()),
    lastUpdate datetime DEFAULT (getdate()),
    updateCount int DEFAULT ((0)),
    PRIMARY KEY (BUID)
);
