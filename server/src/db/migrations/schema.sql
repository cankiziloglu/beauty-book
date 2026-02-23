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
    primary key ("practitionerId", "treatmentId")
);

create table if not exists "room" (
    "id" integer not null primary key,
    "name" text not null,
    "isActive" integer not null default 1,
    "createdAt" text not null default current_timestamp,
    "updatedAt" text not null default current_timestamp,
    "clinicId" integer not null references "clinic" ("id") on delete cascade
);

create table if not exists "roomTreatment" (
    "createdAt" text not null default current_timestamp,
    "updatedAt" text not null default current_timestamp,
    "roomId" integer not null references "room" ("id") on delete cascade,
    "treatmentId" integer not null references "treatment" (
        "id"
    ) on delete cascade,
    primary key ("roomId", "treatmentId")
);

create table if not exists "availability" (
    "id" integer not null primary key,
    "dayOfWeek" integer not null,
    "startTime" text not null,
    "endTime" text not null,
    "createdAt" text not null default current_timestamp,
    "updatedAt" text not null default current_timestamp,
    "practitionerId" integer not null references "practitioner" (
        "id"
    ) on delete cascade
);

create table if not exists "unavailability" (
    "id" integer not null primary key,
    "dayOfWeek" integer not null,
    "startTime" text not null,
    "endTime" text not null,
    "createdAt" text not null default current_timestamp,
    "updatedAt" text not null default current_timestamp,
    "practitionerId" integer not null references "practitioner" (
        "id"
    ) on delete cascade
);

create table if not exists "appointment" (
    "id" integer not null primary key,
    "date" text not null,
    "startTime" text not null,
    "endTime" text not null,
    "bufferEndTime" text not null,
    "status" text not null,
    "notes" text,
    "price" integer not null,
    "createdAt" text not null default current_timestamp,
    "updatedAt" text not null default current_timestamp,
    "clinicId" integer not null references "clinic" ("id") on delete cascade,
    "clientId" text not null references "user" ("id") on delete cascade,
    "practitionerId" integer not null references "practitioner" (
        "id"
    ) on delete cascade,
    "treatmentId" integer not null references "treatment" (
        "id"
    ) on delete cascade,
    "roomId" integer not null references "room" ("id") on delete cascade
)
