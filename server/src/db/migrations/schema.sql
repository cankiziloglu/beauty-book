create table if not exists "clinic" (
    "id" integer not null primary key,
    "name" text not null,
    "slug" text not null,
    "email" text not null unique,
    "phone" text not null,
    "address" text not null,
    "timezone" text not null,
    "minAdvanceHours" integer not null,
    "maxAdvanceDays" integer not null,
    "cancellationHours" integer not null,
    "isActive" integer not null default 1,
    "createdAt" text not null default current_timestamp,
    "updatedAt" text not null default current_timestamp,
    "adminId" text not null references "user" ("id") on delete cascade
);

create table if not exists "practitioner" (
    "id" integer not null primary key,
    "name" text not null,
    "bio" text not null,
    "isActive" integer not null default 1,
    "createdAt" text not null default current_timestamp,
    "updatedAt" text not null default current_timestamp,
    "clinicId" integer not null references "clinic" ("id") on delete cascade
);

create table if not exists "treatment" (
    "id" integer not null primary key,
    "name" text not null,
    "description" text,
    "duration" integer not null,
    "buffer" integer not null,
    "priceCents" integer not null,
    "isActive" integer not null default 1,
    "createdAt" text not null default current_timestamp,
    "updatedAt" text not null default current_timestamp,
    "clinicId" integer not null references "clinic" ("id") on delete cascade,
    "roomId" integer not null references "roomTreatment" (
        "roomId"
    ) on delete set null
);

create table if not exists "practitionerTreatment" (
    "createdAt" text not null default current_timestamp,
    "updatedAt" text not null default current_timestamp,
    "practitionerId" integer not null references "practitioner" (
        "id"
    ) on delete cascade,
    "treatmentId" integer not null references "treatment" (
        "id"
    ) on delete cascade,
    primary key (PRACTITIONERID, TREATMENTID)
)
