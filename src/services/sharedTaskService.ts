import { supabase } from '../lib/supabase';
import type {
  SharedTask,
  TaskComment,
  TaskContextType,
  TaskStatus,
  TaskPriority
} from '../types/contexts';

export class SharedTaskService {
  static async createTask(
    contextType: TaskContextType,
    contextId: string,
    createdBy: string,
    title: string,
    description: string | null,
    assignedTo: string | null,
    assignedRole: string | null,
    priority: TaskPriority = 'medium',
    dueDate: string | null = null
  ): Promise<SharedTask> {
    const { data, error } = await supabase
      .from('shared_tasks')
      .insert({
        context_type: contextType,
        context_id: contextId,
        title,
        description,
        assigned_to: assignedTo,
        assigned_role: assignedRole,
        created_by: createdBy,
        priority,
        due_date: dueDate
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTasksByContext(
    contextType: TaskContextType,
    contextId: string
  ): Promise<SharedTask[]> {
    const { data, error } = await supabase
      .from('shared_tasks')
      .select(`
        *,
        assigned_user:assigned_to (
          id,
          email
        ),
        creator:created_by (
          id,
          email
        )
      `)
      .eq('context_type', contextType)
      .eq('context_id', contextId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getMyTasks(userId: string, status?: TaskStatus): Promise<SharedTask[]> {
    let query = supabase
      .from('shared_tasks')
      .select(`
        *,
        assigned_user:assigned_to (
          id,
          email
        ),
        creator:created_by (
          id,
          email
        )
      `)
      .eq('assigned_to', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('due_date', { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data || [];
  }

  static async updateTaskStatus(
    taskId: string,
    status: TaskStatus
  ): Promise<SharedTask> {
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('shared_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTask(
    taskId: string,
    updates: Partial<SharedTask>
  ): Promise<SharedTask> {
    const { data, error } = await supabase
      .from('shared_tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('shared_tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  }

  static async addComment(
    taskId: string,
    userId: string,
    content: string
  ): Promise<TaskComment> {
    const { data, error } = await supabase
      .from('task_comments')
      .insert({
        task_id: taskId,
        user_id: userId,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTaskComments(taskId: string): Promise<TaskComment[]> {
    const { data, error } = await supabase
      .from('task_comments')
      .select(`
        *,
        user:user_id (
          id,
          email
        )
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getOrganizationTasks(organizationId: string, status?: TaskStatus): Promise<SharedTask[]> {
    let query = supabase
      .from('shared_tasks')
      .select('*')
      .eq('context_type', 'organization')
      .eq('context_id', organizationId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getDelegationTasks(delegationId: string, status?: TaskStatus): Promise<SharedTask[]> {
    let query = supabase
      .from('shared_tasks')
      .select('*')
      .eq('context_type', 'delegation')
      .eq('context_id', delegationId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getTaskStats(contextType: TaskContextType, contextId: string) {
    const tasks = await this.getTasksByContext(contextType, contextId);

    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
      overdue: tasks.filter(t =>
        t.due_date &&
        new Date(t.due_date) < new Date() &&
        t.status !== 'completed'
      ).length
    };
  }
}
