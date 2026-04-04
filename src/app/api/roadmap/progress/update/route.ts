import { NextResponse } from 'next/server';
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { topicId, accuracy, timeSpent, mistakeLog, mistakeType } = await req.json();
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Update Progress
    const { error: progError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        accuracy_percent: accuracy,
        time_spent_minutes: timeSpent,
        last_tested_at: new Date().toISOString()
      });

    if (progError) throw progError;

    // 2. Log Mistake if applicable
    if (mistakeLog) {
      const { error: mistError } = await supabase
        .from('user_mistakes')
        .insert({
          user_id: userId,
          topic_id: topicId,
          mistake_log: mistakeLog,
          mistake_type: mistakeType || 'General'
        });
      
      if (mistError) throw mistError;
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('PROGRESS_UPDATE_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
