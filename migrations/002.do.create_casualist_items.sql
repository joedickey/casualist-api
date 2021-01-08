CREATE TYPE assign_options AS ENUM ('todo', 'doing', 'done');

CREATE TABLE items (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  list_id  INTEGER, 
  name TEXT NOT NULL,
  assign assign_options,
  notes TEXT,
  FOREIGN KEY(list_id) REFERENCES lists(id)
);

