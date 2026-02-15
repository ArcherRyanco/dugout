-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE age_group AS ENUM ('tball', 'coachpitch', 'minors', 'majors', 'juniors', 'seniors');
CREATE TYPE drill_category AS ENUM ('throwing', 'catching', 'batting', 'fielding', 'baserunning', 'coachpitch');
CREATE TYPE drill_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE assignment_target AS ENUM ('team', 'player', 'position');

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  age_group age_group NOT NULL,
  season TEXT NOT NULL,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on team code for fast lookups
CREATE INDEX idx_teams_code ON teams(code);
CREATE INDEX idx_teams_coach_id ON teams(coach_id);

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  number INTEGER,
  positions TEXT[], -- Array of position strings
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_players_team_id ON players(team_id);

-- Parents table
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_parents_email ON parents(email);
CREATE INDEX idx_parents_user_id ON parents(user_id);

-- Player-Parent junction table (many-to-many)
CREATE TABLE player_parents (
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  PRIMARY KEY (player_id, parent_id)
);

CREATE INDEX idx_player_parents_player_id ON player_parents(player_id);
CREATE INDEX idx_player_parents_parent_id ON player_parents(parent_id);

-- Drills table
CREATE TABLE drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category drill_category NOT NULL,
  difficulty drill_difficulty NOT NULL,
  duration_minutes INTEGER,
  equipment TEXT[], -- Array of equipment items
  instructions TEXT, -- Markdown format
  video_url TEXT,
  image_url TEXT,
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for curated drills
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_drills_category ON drills(category);
CREATE INDEX idx_drills_difficulty ON drills(difficulty);
CREATE INDEX idx_drills_is_custom ON drills(is_custom);
CREATE INDEX idx_drills_created_by ON drills(created_by);

-- Assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  drill_id UUID NOT NULL REFERENCES drills(id) ON DELETE CASCADE,
  assigned_to assignment_target NOT NULL,
  target_player_id UUID REFERENCES players(id) ON DELETE CASCADE, -- NULL if assigned_to is 'team' or 'position'
  target_position TEXT, -- NULL if assigned_to is 'team' or 'player'
  due_date DATE,
  reps INTEGER,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_assignments_team_id ON assignments(team_id);
CREATE INDEX idx_assignments_drill_id ON assignments(drill_id);
CREATE INDEX idx_assignments_target_player_id ON assignments(target_player_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_created_by ON assignments(created_by);

-- Completions table
CREATE TABLE completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent_notes TEXT,
  verified BOOLEAN DEFAULT false,
  UNIQUE(assignment_id, player_id) -- Each player can only complete an assignment once
);

CREATE INDEX idx_completions_assignment_id ON completions(assignment_id);
CREATE INDEX idx_completions_player_id ON completions(player_id);
CREATE INDEX idx_completions_completed_at ON completions(completed_at);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Coaches can view their own teams"
  ON teams FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can insert their own teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own teams"
  ON teams FOR UPDATE
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own teams"
  ON teams FOR DELETE
  USING (auth.uid() = coach_id);

-- Parents can view teams their children are on
CREATE POLICY "Parents can view teams of their players"
  ON teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM players p
      JOIN player_parents pp ON p.id = pp.player_id
      JOIN parents par ON pp.parent_id = par.id
      WHERE p.team_id = teams.id
      AND par.user_id = auth.uid()
    )
  );

-- Players policies
CREATE POLICY "Coaches can manage players on their teams"
  ON players FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = players.team_id
      AND t.coach_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their own players"
  ON players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM player_parents pp
      JOIN parents par ON pp.parent_id = par.id
      WHERE pp.player_id = players.id
      AND par.user_id = auth.uid()
    )
  );

-- Parents policies
CREATE POLICY "Coaches can view parents of players on their teams"
  ON parents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM player_parents pp
      JOIN players p ON pp.player_id = p.id
      JOIN teams t ON p.team_id = t.id
      WHERE pp.parent_id = parents.id
      AND t.coach_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their own record"
  ON parents FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Parents can update their own record"
  ON parents FOR UPDATE
  USING (user_id = auth.uid());

-- Player-Parents junction policies
CREATE POLICY "Coaches can manage player-parent links for their teams"
  ON player_parents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM players p
      JOIN teams t ON p.team_id = t.id
      WHERE p.id = player_parents.player_id
      AND t.coach_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their player links"
  ON player_parents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parents par
      WHERE par.id = player_parents.parent_id
      AND par.user_id = auth.uid()
    )
  );

-- Drills policies
CREATE POLICY "Everyone can view curated drills"
  ON drills FOR SELECT
  USING (is_custom = false OR created_by = auth.uid());

CREATE POLICY "Coaches can create custom drills"
  ON drills FOR INSERT
  WITH CHECK (is_custom = true AND created_by = auth.uid());

CREATE POLICY "Coaches can update their own custom drills"
  ON drills FOR UPDATE
  USING (is_custom = true AND created_by = auth.uid());

CREATE POLICY "Coaches can delete their own custom drills"
  ON drills FOR DELETE
  USING (is_custom = true AND created_by = auth.uid());

-- Assignments policies
CREATE POLICY "Coaches can manage assignments for their teams"
  ON assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = assignments.team_id
      AND t.coach_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view assignments for their players"
  ON assignments FOR SELECT
  USING (
    assigned_to = 'team' AND EXISTS (
      SELECT 1 FROM players p
      JOIN player_parents pp ON p.id = pp.player_id
      JOIN parents par ON pp.parent_id = par.id
      WHERE p.team_id = assignments.team_id
      AND par.user_id = auth.uid()
    )
    OR
    assigned_to = 'player' AND EXISTS (
      SELECT 1 FROM player_parents pp
      JOIN parents par ON pp.parent_id = par.id
      WHERE pp.player_id = assignments.target_player_id
      AND par.user_id = auth.uid()
    )
    OR
    assigned_to = 'position' AND EXISTS (
      SELECT 1 FROM players p
      JOIN player_parents pp ON p.id = pp.player_id
      JOIN parents par ON pp.parent_id = par.id
      WHERE p.team_id = assignments.team_id
      AND assignments.target_position = ANY(p.positions)
      AND par.user_id = auth.uid()
    )
  );

-- Completions policies
CREATE POLICY "Coaches can view completions for their teams"
  ON completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN teams t ON a.team_id = t.id
      WHERE a.id = completions.assignment_id
      AND t.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can verify completions"
  ON completions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN teams t ON a.team_id = t.id
      WHERE a.id = completions.assignment_id
      AND t.coach_id = auth.uid()
    )
  );

CREATE POLICY "Parents can create completions for their players"
  ON completions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM player_parents pp
      JOIN parents par ON pp.parent_id = par.id
      WHERE pp.player_id = completions.player_id
      AND par.user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view completions for their players"
  ON completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM player_parents pp
      JOIN parents par ON pp.parent_id = par.id
      WHERE pp.player_id = completions.player_id
      AND par.user_id = auth.uid()
    )
  );

-- Function to generate unique team codes
CREATE OR REPLACE FUNCTION generate_team_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Excluding similar chars
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to ensure unique team code on insert
CREATE OR REPLACE FUNCTION ensure_unique_team_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    LOOP
      new_code := generate_team_code();
      SELECT EXISTS(SELECT 1 FROM teams WHERE code = new_code) INTO code_exists;
      EXIT WHEN NOT code_exists;
    END LOOP;
    NEW.code := new_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate team codes
CREATE TRIGGER trigger_ensure_unique_team_code
  BEFORE INSERT ON teams
  FOR EACH ROW
  EXECUTE FUNCTION ensure_unique_team_code();
