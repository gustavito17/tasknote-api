const supabase = require('../../../config/supabase');

const NoteModel = {
  tableName: 'notes',

  async findById(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  async findByIdAndUserId(id, userId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) return null;
    return data;
  },

  async findByTaskId(taskId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
  },

  async findByTaskIdAndUserId(taskId, userId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
  },

  async create(noteData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(noteData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, noteData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...noteData, updated_at: new Date().toISOString() })
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

module.exports = NoteModel;
