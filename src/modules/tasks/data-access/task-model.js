const supabase = require('../../../config/supabase');

const TaskModel = {
  tableName: 'tasks',

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

  async findAllByUserId(userId, options = {}) {
    const { status, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: tasks, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      tasks: tasks || [],
      total: count || 0
    };
  },

  async create(taskData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(taskData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, taskData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...taskData, updated_at: new Date().toISOString() })
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
  },

  async countByUserId(userId, status = null) {
    let query = supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { count, error } = await query;
    
    if (error) throw error;
    return count || 0;
  }
};

module.exports = TaskModel;
