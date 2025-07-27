-- Create mock FiveM users table in dashboard database for development
-- This allows FiveM features to work when the actual FiveM server database is unavailable
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier VARCHAR(255) UNIQUE NOT NULL,
  firstname VARCHAR(255) DEFAULT '',
  lastname VARCHAR(255) DEFAULT '',
  dateofbirth VARCHAR(255) DEFAULT '',
  sex VARCHAR(10) DEFAULT 'M',
  height VARCHAR(10) DEFAULT '180',
  job VARCHAR(255) DEFAULT 'unemployed',
  job_grade INTEGER DEFAULT 0,
  loadout TEXT DEFAULT '[]',
  position TEXT DEFAULT '{"x":-269.4,"y":-955.3,"z":31.2,"heading":205.8}',
  skin TEXT DEFAULT '{}',
  money BIGINT DEFAULT 5000,
  bank BIGINT DEFAULT 5000,
  dirty_money BIGINT DEFAULT 0,
  group_name VARCHAR(255) DEFAULT 'user',
  last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Insert some mock data for development
INSERT INTO users (
    identifier,
    firstname,
    lastname,
    job,
    money,
    bank,
    group_name
  )
VALUES (
    'steam:110000100000001',
    'John',
    'Doe',
    'police',
    15000,
    25000,
    'admin'
  ),
  (
    'steam:110000100000002',
    'Jane',
    'Smith',
    'ambulance',
    12000,
    20000,
    'moderator'
  ),
  (
    'steam:110000100000003',
    'Mike',
    'Johnson',
    'mechanic',
    8000,
    15000,
    'user'
  ),
  (
    'steam:110000100000004',
    'Sarah',
    'Wilson',
    'lawyer',
    20000,
    50000,
    'vip'
  ),
  (
    'steam:110000100000005',
    'Tom',
    'Brown',
    'taxi',
    6000,
    12000,
    'user'
  ) ON CONFLICT (identifier) DO NOTHING;
-- Create additional FiveM-related tables if they don't exist
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner VARCHAR(255) NOT NULL,
  plate VARCHAR(20) UNIQUE NOT NULL,
  vehicle TEXT NOT NULL,
  props TEXT DEFAULT '{}',
  stored BOOLEAN DEFAULT true,
  parking VARCHAR(255) DEFAULT 'garage',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Insert some mock vehicles
INSERT INTO vehicles (owner, plate, vehicle, stored)
VALUES (
    'steam:110000100000001',
    'POLICE01',
    '{"model":"police","label":"Police Cruiser"}',
    true
  ),
  (
    'steam:110000100000002',
    'AMBU001',
    '{"model":"ambulance","label":"Ambulance"}',
    true
  ),
  (
    'steam:110000100000003',
    'MECH001',
    '{"model":"towtruck","label":"Tow Truck"}',
    true
  ) ON CONFLICT (plate) DO NOTHING;
-- Create jobs table for statistics
CREATE TABLE IF NOT EXISTS jobs (
  name VARCHAR(255) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  whitelisted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Insert default jobs
INSERT INTO jobs (name, label, whitelisted)
VALUES ('unemployed', 'Unemployed', false),
  ('police', 'Police', true),
  ('ambulance', 'EMS', true),
  ('mechanic', 'Mechanic', false),
  ('taxi', 'Taxi Driver', false),
  ('lawyer', 'Lawyer', false),
  ('realtor', 'Real Estate', false) ON CONFLICT (name) DO NOTHING;
