CREATE OR REPLACE FUNCTION get_challenges_for_user(user_id uuid)
RETURNS SETOF challenges
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM challenges
  WHERE challenges.user_id = user_id
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION create_challenge(
  title text,
  description text,
  challenge_type text,
  daily_goal text,
  creator_id uuid
)
RETURNS challenges
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO challenges (title, description, type, daily_goal, user_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
$$;