const supabase = require('../../../config/supabase');

const UserModel = {
  tableName: 'users',

  async findById(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return null;
    return data;
  },

  async findByUsername(username) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) return null;
    return data;
  },

  async create(userData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, userData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { id };
  }
};

module.exports = UserModel;
