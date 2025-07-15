/*
  # Analytics Schema for Oxford ERP

  1. New Tables
    - `analytics_updates` - Stores all analytics metric updates
    - `analytics_metrics` - Stores current metric values
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create analytics_updates table
CREATE TABLE IF NOT EXISTS analytics_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('attendance', 'marks', 'fees', 'enrollment', 'placement', 'other')),
  metric_name TEXT NOT NULL,
  previous_value NUMERIC NULL,
  new_value NUMERIC NOT NULL,
  percentage_change NUMERIC NULL,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create analytics_metrics table to store current values
CREATE TABLE IF NOT EXISTS analytics_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('attendance', 'marks', 'fees', 'enrollment', 'placement', 'other')),
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  department TEXT,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(metric_type, metric_name, department)
);

-- Enable Row Level Security
ALTER TABLE analytics_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Analytics updates policies
CREATE POLICY "Admin users can view all analytics updates" 
  ON analytics_updates FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('hod', 'principal', 'director')
    )
  );

CREATE POLICY "Admin users can insert analytics updates" 
  ON analytics_updates FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('hod', 'principal', 'director')
    )
  );

-- Analytics metrics policies
CREATE POLICY "All authenticated users can view analytics metrics" 
  ON analytics_metrics FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admin users can update analytics metrics" 
  ON analytics_metrics FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('hod', 'principal', 'director')
    )
  );

CREATE POLICY "Admin users can insert analytics metrics" 
  ON analytics_metrics FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('hod', 'principal', 'director')
    )
  );

-- Create function to update analytics_metrics when analytics_updates are inserted
CREATE OR REPLACE FUNCTION update_analytics_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert into analytics_metrics
  INSERT INTO analytics_metrics (metric_type, metric_name, value, department)
  VALUES (NEW.metric_type, NEW.metric_name, NEW.new_value, NEW.department)
  ON CONFLICT (metric_type, metric_name, COALESCE(department, ''))
  DO UPDATE SET 
    value = NEW.new_value,
    last_updated = now(),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update metrics when updates are inserted
CREATE TRIGGER update_metrics_on_analytics_update
  AFTER INSERT ON analytics_updates
  FOR EACH ROW EXECUTE FUNCTION update_analytics_metrics();

-- Create triggers for updated_at
CREATE TRIGGER update_analytics_updates_modtime
  BEFORE UPDATE ON analytics_updates
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_analytics_metrics_modtime
  BEFORE UPDATE ON analytics_metrics
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();