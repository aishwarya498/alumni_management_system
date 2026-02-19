-- Create Database
CREATE DATABASE IF NOT EXISTS alumni_db;
USE alumni_db;

-- Drop existing tables if exists
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS alumni;

-- Create Roles Table
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_role_name (name)
);

-- Create Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_is_active (is_active)
);

-- Create User Roles Junction Table
CREATE TABLE user_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_role (user_id, role_id),
  INDEX idx_user_id (user_id),
  INDEX idx_role_id (role_id)
);

-- Create Alumni Table with user_id reference
CREATE TABLE alumni (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  graduation_year INT,
  degree VARCHAR(100) NOT NULL,
  field_of_study VARCHAR(100) NOT NULL,
  current_company VARCHAR(100),
  current_position VARCHAR(100),
  city VARCHAR(50),
  country VARCHAR(50),
  bio TEXT,
  profile_image VARCHAR(255),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_graduation_year (graduation_year),
  INDEX idx_created_at (created_at),
  INDEX idx_user_id (user_id)
);

-- Insert Roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Administrator with full access', '["view_alumni","create_alumni","edit_alumni","delete_alumni","manage_users","manage_roles","view_reports"]'),
('manager', 'Manager can manage alumni and view reports', '["view_alumni","create_alumni","edit_alumni","delete_alumni","view_reports"]'),
('alumni', 'Alumni can view and edit their profile', '["view_alumni","edit_own_profile"]'),
('guest', 'Guest can only view alumni', '["view_alumni"]');

-- Insert Sample Users (Passwords are hashed. In production, use bcrypt)
-- Password for all demo accounts: Demo@123
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, is_active) VALUES
('admin_user', 'admin@university.edu', '$2b$10$YourHashedPasswordHere', 'Admin', 'User', '9000000001', TRUE),
('manager_user', 'manager@university.edu', '$2b$10$YourHashedPasswordHere', 'Manager', 'User', '9000000002', TRUE),
('rajesh_kumar', 'rajesh.kumar@example.com', '$2b$10$YourHashedPasswordHere', 'Rajesh', 'Kumar', '9876543210', TRUE),
('priya_singh', 'priya.singh@example.com', '$2b$10$YourHashedPasswordHere', 'Priya', 'Singh', '9876543211', TRUE),
('amit_patel', 'amit.patel@example.com', '$2b$10$YourHashedPasswordHere', 'Amit', 'Patel', '9876543212', TRUE),
('vikas_sharma', 'vikas.sharma@example.com', '$2b$10$YourHashedPasswordHere', 'Vikas', 'Sharma', '9876543214', TRUE);

-- Assign Roles to Users
INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES
(1, 1, 1),  -- admin_user -> admin
(2, 2, 1),  -- manager_user -> manager
(3, 3, 1),  -- rajesh_kumar -> alumni
(4, 3, 1),  -- priya_singh -> alumni
(5, 3, 1),  -- amit_patel -> alumni
(6, 3, 1);  -- vikas_sharma -> alumni

-- Insert Alumni Data with user_id reference
INSERT INTO alumni (user_id, first_name, last_name, email, phone, graduation_year, degree, field_of_study, current_company, current_position, city, country, bio, created_by) VALUES
(3, 'Rajesh', 'Kumar', 'rajesh.kumar@example.com', '9876543210', 2015, 'Bachelor of Engineering', 'Computer Science', 'TCS', 'Senior Software Engineer', 'Bangalore', 'India', 'Passionate about cloud technologies', 1),
(4, 'Priya', 'Singh', 'priya.singh@example.com', '9876543211', 2016, 'Bachelor of Engineering', 'Information Technology', 'Infosys', 'Software Developer', 'Pune', 'India', 'Full-stack developer', 1),
(5, 'Amit', 'Patel', 'amit.patel@example.com', '9876543212', 2014, 'Bachelor of Technology', 'Electronics', 'HCL Technologies', 'Tech Lead', 'Noida', 'India', 'Team leader and mentor', 1),
(NULL, 'Neha', 'Gupta', 'neha.gupta@example.com', '9876543213', 2017, 'Bachelor of Engineering', 'Mechanical', 'Tata Steel', 'Project Manager', 'Jamshedpur', 'India', 'Project management expert', 1),
(6, 'Vikas', 'Sharma', 'vikas.sharma@example.com', '9876543214', 2015, 'Master of Technology', 'Software Engineering', 'Google', 'Software Engineer', 'Bangalore', 'India', 'AI/ML enthusiast', 1),
(NULL, 'Anjali', 'Verma', 'anjali.verma@example.com', '9876543215', 2018, 'Bachelor of Science', 'Data Science', 'IBM', 'Data Analyst', 'Hyderabad', 'India', 'Data science professional', 1),
(NULL, 'Arjun', 'Reddy', 'arjun.reddy@example.com', '9876543216', 2016, 'Bachelor of Engineering', 'Computer Science', 'Microsoft', 'Cloud Architect', 'Seattle', 'USA', 'Cloud solution architect', 1),
(NULL, 'Divya', 'Nair', 'divya.nair@example.com', '9876543217', 2017, 'Bachelor of Commerce', 'Finance', 'Goldman Sachs', 'Financial Analyst', 'London', 'UK', 'Finance professional', 1),
(NULL, 'Rohan', 'Desai', 'rohan.desai@example.com', '9876543218', 2014, 'Bachelor of Engineering', 'Civil Engineering', 'Larsen & Toubro', 'Project Engineer', 'Mumbai', 'India', 'Civil engineer', 1),
(NULL, 'Sakshi', 'Joshi', 'sakshi.joshi@example.com', '9876543219', 2019, 'Master of Business Administration', 'Marketing', 'Amazon', 'Marketing Manager', 'Delhi', 'India', 'Marketing leader', 1);

-- Create Networking posts
CREATE TABLE networking_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(150) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Create Jobs table
CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  company VARCHAR(150),
  location VARCHAR(100),
  posted_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_company (company),
  INDEX idx_location (location)
);

-- Create Donations table
CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_name VARCHAR(150) NOT NULL,
  description TEXT,
  goal_amount DECIMAL(12,2) DEFAULT 0,
  collected_amount DECIMAL(12,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Events table
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  event_date DATETIME,
  location VARCHAR(150),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Success Stories table
CREATE TABLE stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  author_name VARCHAR(100),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Feedback table
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message TEXT NOT NULL,
  response TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Views for Alumni Summary
CREATE VIEW alumni_summary AS
SELECT 
  a.id,
  CONCAT(a.first_name, ' ', a.last_name) AS full_name,
  a.email,
  a.degree,
  a.field_of_study,
  a.current_company,
  a.graduation_year,
  GROUP_CONCAT(r.name) AS roles
FROM alumni a
LEFT JOIN users u ON a.user_id = u.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY a.id
ORDER BY a.created_at DESC;

-- Create View for User Details with Roles
CREATE VIEW user_details_view AS
SELECT 
  u.id,
  u.username,
  u.email,
  u.first_name,
  u.last_name,
  u.is_active,
  GROUP_CONCAT(r.name SEPARATOR ',') AS roles,
  u.created_at
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id;

-- Create Indexes for better query performance
CREATE INDEX idx_full_name ON alumni (first_name, last_name);
CREATE INDEX idx_company ON alumni (current_company);
CREATE INDEX idx_alumni_created_by ON alumni (created_by);

COMMIT;
