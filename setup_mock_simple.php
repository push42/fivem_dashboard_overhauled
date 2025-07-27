<?php
try {
    $dsn = "pgsql:host=localhost;port=5432;dbname=fivem_dashboard";
    $pdo = new PDO($dsn, 'postgres', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Step 1: Creating users table...\n";

    $sql = "
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
        position TEXT DEFAULT '{\"x\":-269.4,\"y\":-955.3,\"z\":31.2,\"heading\":205.8}',
        skin TEXT DEFAULT '{}',
        money BIGINT DEFAULT 5000,
        bank BIGINT DEFAULT 5000,
        dirty_money BIGINT DEFAULT 0,
        group_name VARCHAR(255) DEFAULT 'user',
        last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );";

    $pdo->exec($sql);
    echo "✅ Users table created\n";

    echo "Step 2: Inserting mock data...\n";
    $insertSql = "
    INSERT INTO users (identifier, firstname, lastname, job, money, bank, group_name) VALUES
    ('steam:110000100000001', 'John', 'Doe', 'police', 15000, 25000, 'admin'),
    ('steam:110000100000002', 'Jane', 'Smith', 'ambulance', 12000, 20000, 'moderator'),
    ('steam:110000100000003', 'Mike', 'Johnson', 'mechanic', 8000, 15000, 'user'),
    ('steam:110000100000004', 'Sarah', 'Wilson', 'lawyer', 20000, 50000, 'vip'),
    ('steam:110000100000005', 'Tom', 'Brown', 'taxi', 6000, 12000, 'user')
    ON CONFLICT (identifier) DO NOTHING;";

    $pdo->exec($insertSql);
    echo "✅ Mock data inserted\n";

    // Check user count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Mock users created: {$count['count']}\n";

    echo "Step 3: Creating vehicles table...\n";
    $vehiclesSql = "
    CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        owner VARCHAR(255) NOT NULL,
        plate VARCHAR(20) UNIQUE NOT NULL,
        vehicle TEXT NOT NULL,
        props TEXT DEFAULT '{}',
        stored BOOLEAN DEFAULT true,
        parking VARCHAR(255) DEFAULT 'garage',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );";

    $pdo->exec($vehiclesSql);
    echo "✅ Vehicles table created\n";

    echo "Step 4: Creating jobs table...\n";
    $jobsSql = "
    CREATE TABLE IF NOT EXISTS jobs (
        name VARCHAR(255) PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        whitelisted BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );";

    $pdo->exec($jobsSql);
    echo "✅ Jobs table created\n";

    // Insert default jobs
    $jobsInsert = "
    INSERT INTO jobs (name, label, whitelisted) VALUES
    ('unemployed', 'Unemployed', false),
    ('police', 'Police', true),
    ('ambulance', 'EMS', true),
    ('mechanic', 'Mechanic', false),
    ('taxi', 'Taxi Driver', false),
    ('lawyer', 'Lawyer', false),
    ('realtor', 'Real Estate', false)
    ON CONFLICT (name) DO NOTHING;";

    $pdo->exec($jobsInsert);
    echo "✅ Default jobs inserted\n";

    echo "\n🎉 All mock FiveM tables created successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
