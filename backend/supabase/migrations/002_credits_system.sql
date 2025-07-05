-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  game_credits INTEGER DEFAULT 0,
  team_plan_active BOOLEAN DEFAULT FALSE,
  team_plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create purchase_history table
CREATE TABLE IF NOT EXISTS purchase_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  product_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  credits_added INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  logo_url TEXT,
  team_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  jersey_number TEXT,
  position TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Add team_id to games table
ALTER TABLE games ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- Create free_tier_usage table to track monthly free usage
CREATE TABLE IF NOT EXISTS free_tier_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  games_created INTEGER DEFAULT 0,
  teams_created INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- RLS policies for new tables
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_tier_usage ENABLE ROW LEVEL SECURITY;

-- User credits policies
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can update credits" ON user_credits
  FOR ALL USING (true);

-- Purchase history policies
CREATE POLICY "Users can view own purchases" ON purchase_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage purchases" ON purchase_history
  FOR ALL USING (true);

-- Teams policies
CREATE POLICY "Anyone can view teams" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update teams" ON teams
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete teams" ON teams
  FOR DELETE USING (auth.uid() = owner_id);

-- Team members policies
CREATE POLICY "Anyone can view team members" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Team owners and admins can manage members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Free tier usage policies
CREATE POLICY "Users can view own usage" ON free_tier_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage usage" ON free_tier_usage
  FOR ALL USING (true);

-- Create indexes
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_purchase_history_user_id ON purchase_history(user_id);
CREATE INDEX idx_teams_owner_id ON teams(owner_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_free_tier_usage_user_month ON free_tier_usage(user_id, month);

-- Create functions to check usage limits
CREATE OR REPLACE FUNCTION check_game_creation_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_credits INTEGER;
  v_free_games INTEGER;
  v_current_month DATE;
BEGIN
  v_current_month := DATE_TRUNC('month', NOW());
  
  -- Check if user has credits
  SELECT game_credits INTO v_credits
  FROM user_credits
  WHERE user_id = p_user_id;
  
  IF v_credits > 0 THEN
    RETURN TRUE;
  END IF;
  
  -- Check free tier usage
  SELECT games_created INTO v_free_games
  FROM free_tier_usage
  WHERE user_id = p_user_id AND month = v_current_month;
  
  -- Allow if under free tier limit (3 games per month)
  RETURN COALESCE(v_free_games, 0) < 3;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_team_creation_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_team_plan_active BOOLEAN;
  v_teams_owned INTEGER;
BEGIN
  -- Check if user has team plan
  SELECT team_plan_active INTO v_team_plan_active
  FROM user_credits
  WHERE user_id = p_user_id;
  
  IF v_team_plan_active THEN
    RETURN TRUE;
  END IF;
  
  -- Count owned teams
  SELECT COUNT(*) INTO v_teams_owned
  FROM teams
  WHERE owner_id = p_user_id;
  
  -- Allow only 1 team without plan
  RETURN v_teams_owned < 1;
END;
$$ LANGUAGE plpgsql;

-- Update triggers
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();