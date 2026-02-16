#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Load environment
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function updateDrills() {
  // Load drill resources
  const resources = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../.firecrawl/drill-resources.json'), 'utf8')
  );

  console.log(`Updating ${resources.drills.length} drills...`);

  for (const drill of resources.drills) {
    // Find drill by title
    const searchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/drills?title=eq.${encodeURIComponent(drill.title)}&select=id`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    
    const existing = await searchRes.json();
    
    if (!existing || existing.length === 0) {
      console.log(`  ⚠️ Not found: ${drill.title}`);
      continue;
    }

    const drillId = existing[0].id;
    
    // Update with video and instructions
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/drills?id=eq.${drillId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          video_url: drill.video_url,
          instructions: JSON.stringify(drill.instructions),
          equipment: drill.equipment
        })
      }
    );

    if (updateRes.ok) {
      console.log(`  ✅ Updated: ${drill.title}`);
    } else {
      const err = await updateRes.text();
      console.log(`  ❌ Failed: ${drill.title} - ${err}`);
    }
  }

  console.log('Done!');
}

updateDrills().catch(console.error);
