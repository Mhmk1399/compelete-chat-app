export const migration024ContactNames = {
  version: 24,
  up: ({ db, tableExists }) => {
    if (!tableExists("users")) return;
    db.run(`CREATE TABLE IF NOT EXISTS contact_names (
      owner_user_id INTEGER NOT NULL,
      contact_username TEXT NOT NULL COLLATE NOCASE,
      custom_name TEXT NOT NULL,
      PRIMARY KEY (owner_user_id, contact_username),
      FOREIGN KEY (owner_user_id) REFERENCES users (id) ON DELETE CASCADE
    )`);
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_contact_names_owner ON contact_names (owner_user_id)`,
    );
  },
};
