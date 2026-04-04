import { NextResponse } from 'next/server';
import { createClient } from "../../../../utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { roadmapData, metadata, id } = await req.json();
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 🛡️ v39.0 Forensic Identity Anchor (Self-Healing)
    // Ensures the user exists in public.users to prevent FK constraint failures
    const user = session.user;
    const meta = user.user_metadata;
    const fullName = meta?.full_name || meta?.name || user.email?.split('@')[0] || 'Member';

    await supabase
      .from('users')
      .upsert([
        { id: user.id, email: user.email, name: fullName }
      ], { onConflict: 'id' });

    // 🚀 v42.0 Resilient Enrollment (Diagnostic Audit)
    let query;
    const roadmapPayload = {
      user_id: session.user.id,
      roadmap_data: roadmapData,
      metadata: {
        ...metadata,
        is_enrolled: true,
        enrolled_at: new Date().toISOString(),
        completed_tasks: metadata?.completed_tasks || []
      }
    };

    if (id) {
       query = supabase
         .from('user_roadmaps')
         .upsert({ ...roadmapPayload, id }, { onConflict: 'id' });
    } else {
       query = supabase
         .from('user_roadmaps')
         .insert(roadmapPayload);
    }

    const { data, error } = await query.select();

    if (error) {
       console.error('DATABASE_SYNC_ERROR:', error);
       return NextResponse.json({ error: `Database Sync Failed: ${error.message}`, details: error }, { status: 500 });
    }

    const enrollmentRecord = Array.isArray(data) ? data[0] : data;

    if (!enrollmentRecord) {
       return NextResponse.json({ error: 'Enrollment record was not created/found after transaction.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, enrollment: enrollmentRecord });

  } catch (error: any) {
    console.error('ENROLL_CRITICAL_FATAL:', error);
    return NextResponse.json({ error: `Critical Forensic Error: ${error.message}` }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_roadmaps')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Filter for enrolled ones in app logic just in case
    const enrolled = (data || []).filter((r: any) => r.metadata?.is_enrolled === true);

    return NextResponse.json(enrolled);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
