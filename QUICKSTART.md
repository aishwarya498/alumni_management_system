# Quick Start Guide - Alumni Management System

## 🚀 Getting Started in 5 Minutes

### Step 1: Database Setup

1. Open MySQL and run:
```sql
mysql -u root -p < backend/alumni_schema.sql
```

Or manually:
1. Open MySQL
2. Run commands from `backend/alumni_schema.sql`
3. Database `alumni_db` will be created with sample data

### Step 2: Backend Setup

```bash
# Open terminal in project root
cd backend

# Install dependencies
npm install

# Check your MySQL credentials in .env
# Default is user: root, password: empty
# Update if needed

# Start backend server
npm start
# Backend running at http://localhost:5000
```

### Step 3: Frontend Setup

```bash
# Open new terminal in project root
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm start
# Frontend running at http://localhost:3000
```

## 📖 Usage Guide

### First Time Access

1. **Open Browser**: Go to `http://localhost:3000`
2. **Home Page**: View statistics and features
3. **View Alumni**: Click "All Alumni" to see 10 sample profiles
4. **Search**: Try searching by name (e.g., "Rajesh" or "TCS")
5. **Add Alumni**: Create new profiles
6. **Edit/Delete**: Manage existing profiles

### Navigation

- **Home** - Dashboard with statistics
- **All Alumni** - Browse all profiles in table format
- **Add Alumni** - Create new alumni profile
- **Search** - Find alumni by any criteria

## 🛠️ Configuration

### Backend (.env)
```
DB_HOST=localhost          # MySQL server address
DB_USER=root              # MySQL username
DB_PASSWORD=              # MySQL password
DB_NAME=alumni_db         # Database name
DB_PORT=3306              # MySQL port
PORT=5000                 # Backend server port
NODE_ENV=development      # Environment
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Sample Alumni Records

The database includes 10 sample records:
1. Rajesh Kumar - TCS
2. Priya Singh - Infosys
3. Amit Patel - HCL Technologies
4. Neha Gupta - Tata Steel
5. Vikas Sharma - Google
6. Anjali Verma - IBM
7. Arjun Reddy - Microsoft
8. Divya Nair - Goldman Sachs
9. Rohan Desai - Larsen & Toubro
10. Sakshi Joshi - Amazon

## 🔍 Testing Features

### Test CRUD Operations
1. **Create**: Add Alumni → Fill form → Submit
2. **Read**: All Alumni → View list or click View button
3. **Update**: Click Edit → Modify data → Update
4. **Delete**: Click Delete → Confirm

### Test Search
1. Go to Search page
2. Try: "Rajesh" or "Google" or "TCS"
3. View instant results

### Test Validation
1. Try adding alumni without required fields
2. Try invalid email format
3. Try invalid phone format
4. See error messages

## 🎨 Color Scheme

- **Primary**: #667eea (Purple Blue)
- **Secondary**: #764ba2 (Dark Purple)
- **Accent**: #ffd700 (Gold)
- **Text**: #333 (Dark Gray)
- **Background**: #f8f9fa (Light Gray)

## 📊 API Examples

### Get All Alumni
```bash
curl http://localhost:5000/api/alumni/all
```

### Search Alumni
```bash
curl "http://localhost:5000/api/alumni/search?searchTerm=Google"
```

### Create Alumni
```bash
curl -X POST http://localhost:5000/api/alumni/create \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"Jane",
    "last_name":"Smith",
    "email":"jane@example.com",
    "phone":"9876543220",
    "graduation_year":2021,
    "degree":"Bachelor of Science",
    "field_of_study":"Information Technology",
    "current_company":"Apple",
    "current_position":"Developer",
    "city":"New York",
    "country":"USA"
  }'
```

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MySQL is running, verify .env credentials |
| Frontend won't load | Ensure backend is running on port 5000 |
| Database not connecting | Run alumni_schema.sql first |
| CORS errors | Backend CORS middleware is enabled (already configured) |
| Port already in use | Change PORT in .env or kill the process |

## 🔗 Useful Links

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Backend Health: http://localhost:5000/health
- API Base: http://localhost:5000/api

## 📱 Responsive Design

Works perfectly on:
- Desktop (1920px and above)
- Laptop (1024px to 1919px)
- Tablet (768px to 1023px)
- Mobile (Below 768px)

## 🆘 Need Help?

1. Check the README.md for detailed documentation
2. Verify all npm packages are installed
3. Ensure MySQL service is running
4. Check .env files for correct configuration
5. Check browser console (F12) for error messages

## ✅ Verification Checklist

- [ ] MySQL database created
- [ ] Backend dependencies installed
- [ ] Backend server running (Port 5000)
- [ ] Frontend dependencies installed
- [ ] Frontend server running (Port 3000)
- [ ] Can access home page
- [ ] Can view alumni list
- [ ] Can create new alumni
- [ ] Can search alumni
- [ ] Can edit/delete alumni

---

**You're all set! Enjoy using the Alumni Management System! 🎓**
