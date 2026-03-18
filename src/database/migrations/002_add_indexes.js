/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .raw('CREATE INDEX idx_users_email ON users(email)')
    .raw('CREATE INDEX idx_tasks_user_id ON tasks(user_id)')
    .raw('CREATE INDEX idx_tasks_status ON tasks(status)')
    .raw('CREATE INDEX idx_notes_task_id ON notes(task_id)')
    .raw('CREATE INDEX idx_notes_user_id ON notes(user_id)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .raw('DROP INDEX IF EXISTS idx_users_email')
    .raw('DROP INDEX IF EXISTS idx_tasks_user_id')
    .raw('DROP INDEX IF EXISTS idx_tasks_status')
    .raw('DROP INDEX IF EXISTS idx_notes_task_id')
    .raw('DROP INDEX IF EXISTS idx_notes_user_id');
};
