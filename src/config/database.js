// Database configuration moved to Supabase
// This file is kept for backward compatibility

const supabase = require('./supabase');

module.exports = {
  supabase,
  // Legacy Knex compatibility (deprecated)
  raw: async (query) => {
    console.warn('Using deprecated database.raw() - migrate to Supabase queries');
    return supabase.from('query').select('*');
  }
};
