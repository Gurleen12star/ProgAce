import { NextResponse } from 'next/server';
import { createClient } from "../../../../utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { enrollmentId, taskId, isCompleted } = await req.json();
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 🚀 v31.1 Roadmap Progress Persistence
    // 1. Fetch current roadmap state
    const { data: current, error: fetchErr } = await supabase
      .from('user_roadmaps')
      .select('metadata')
      .eq('id', enrollmentId)
      .eq('user_id', session.user.id)
      .single();

    if (fetchErr) throw fetchErr;

    const metadata = current.metadata || {};
    let completedTasks = Array.isArray(metadata.completed_tasks) ? metadata.completed_tasks : [];

    if (isCompleted) {
      if (!completedTasks.includes(taskId)) completedTasks.push(taskId);
    } else {
      completedTasks = completedTasks.filter((id: string) => id !== taskId);
    }

    // 2. Update with new progress array
    const { error: updateErr } = await supabase
      .from('user_roadmaps')
      .update({
        metadata: {
          ...metadata,
          completed_tasks: completedTasks,
          last_active_at: new Date().toISOString()
        }
      })
      .eq('id', enrollmentId)
      .eq('user_id', session.user.id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, completedTasks });

  } catch (error: any) {
    console.error('SYNC_PROGRESS_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
