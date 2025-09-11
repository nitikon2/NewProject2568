const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabaseSchema() {
    let connection;
    
    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'alumni_db'
        });

        console.log('Connected to MySQL database');

        // Check if columns already exist
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
        `, [process.env.DB_NAME || 'alumni_db']);

        const existingColumns = columns.map(col => col.COLUMN_NAME);
        const newColumns = ['linkedin', 'facebook', 'twitter', 'github', 'website', 'skills', 'is_public_profile', 'profile_views'];
        
        const columnsToAdd = newColumns.filter(col => !existingColumns.includes(col));

        if (columnsToAdd.length === 0) {
            console.log('All columns already exist. No updates needed.');
            return;
        }

        console.log('Adding columns:', columnsToAdd.join(', '));

        // Add new columns
        const alterStatements = [];
        
        if (columnsToAdd.includes('linkedin')) {
            alterStatements.push('ADD COLUMN linkedin VARCHAR(255) DEFAULT NULL');
        }
        if (columnsToAdd.includes('facebook')) {
            alterStatements.push('ADD COLUMN facebook VARCHAR(255) DEFAULT NULL');
        }
        if (columnsToAdd.includes('twitter')) {
            alterStatements.push('ADD COLUMN twitter VARCHAR(255) DEFAULT NULL');
        }
        if (columnsToAdd.includes('github')) {
            alterStatements.push('ADD COLUMN github VARCHAR(255) DEFAULT NULL');
        }
        if (columnsToAdd.includes('website')) {
            alterStatements.push('ADD COLUMN website VARCHAR(255) DEFAULT NULL');
        }
        if (columnsToAdd.includes('skills')) {
            alterStatements.push('ADD COLUMN skills TEXT DEFAULT NULL');
        }
        if (columnsToAdd.includes('is_public_profile')) {
            alterStatements.push('ADD COLUMN is_public_profile BOOLEAN DEFAULT TRUE');
        }
        if (columnsToAdd.includes('profile_views')) {
            alterStatements.push('ADD COLUMN profile_views INT DEFAULT 0');
        }

        if (alterStatements.length > 0) {
            const alterQuery = `ALTER TABLE users ${alterStatements.join(', ')}`;
            await connection.execute(alterQuery);
            console.log('Successfully added new columns to users table');
        }

        // Update existing records with default values
        await connection.execute(`
            UPDATE users 
            SET linkedin = COALESCE(linkedin, ''), 
                facebook = COALESCE(facebook, ''), 
                twitter = COALESCE(twitter, ''), 
                github = COALESCE(github, ''), 
                website = COALESCE(website, ''), 
                skills = COALESCE(skills, '[]'),
                is_public_profile = COALESCE(is_public_profile, TRUE),
                profile_views = COALESCE(profile_views, 0)
        `);
        console.log('Updated existing records with default values');

        // Create indexes for better performance
        try {
            await connection.execute('CREATE INDEX idx_profile_views ON users(profile_views)');
            console.log('Created index for profile_views');
        } catch (err) {
            if (!err.message.includes('Duplicate key name')) {
                console.log('Index for profile_views may already exist');
            }
        }

        try {
            await connection.execute('CREATE INDEX idx_public_profile ON users(is_public_profile)');
            console.log('Created index for is_public_profile');
        } catch (err) {
            if (!err.message.includes('Duplicate key name')) {
                console.log('Index for is_public_profile may already exist');
            }
        }

        console.log('✅ Database schema update completed successfully!');

    } catch (error) {
        console.error('❌ Error updating database schema:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Run the update
updateDatabaseSchema();
