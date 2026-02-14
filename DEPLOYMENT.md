# Deployment Guide - Alumni Management System

## 🚀 Deployment Options

This guide covers multiple deployment options for the Alumni Management System.

## 1. Local Development

### Windows

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### macOS/Linux

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

## 2. Docker Deployment

### Create Dockerfile for Backend

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Create Dockerfile for Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create docker-compose.yml

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: alumni_db
    ports:
      - "3306:3306"
    volumes:
      - ./backend/alumni_schema.sql:/docker-entrypoint-initdb.d/alumni_schema.sql
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: root
      DB_NAME: alumni_db
      PORT: 5000
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api

volumes:
  mysql_data:
```

### Run with Docker Compose

```bash
docker-compose up -d
```

## 3. Heroku Deployment

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku Account** and login
   ```bash
   heroku login
   ```

3. **Create app**
   ```bash
   cd backend
   heroku create your-alumni-api
   ```

4. **Add MySQL (ClearDB)**
   ```bash
   heroku addons:create cleardb:ignite --app your-alumni-api
   ```

5. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production --app your-alumni-api
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment

1. **Update API URL in .env**
   ```
   REACT_APP_API_URL=https://your-alumni-api.herokuapp.com/api
   ```

2. **Build for production**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy to Vercel or Netlify**

## 4. Netlify Deployment (Frontend)

1. **Build project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Login to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=build
   ```

4. **Configure environment variables**
   - Go to Site Settings → Build & deploy → Environment
   - Add: `REACT_APP_API_URL=your-backend-url`

## 5. AWS Deployment

### Backend (EC2)

1. **Launch EC2 instance** (Amazon Linux 2)

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

4. **Install MySQL client**
   ```bash
   sudo yum install -y mysql
   ```

5. **Clone and setup backend**
   ```bash
   git clone your-repo
   cd alumni_management_system/backend
   npm install
   ```

6. **Configure .env** with RDS MySQL details

7. **Start with PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name alumni-backend
   pm2 startup
   pm2 save
   ```

### Frontend (S3 + CloudFront)

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-alumni-portal
   ```

3. **Upload build files**
   ```bash
   aws s3 sync build/ s3://your-alumni-portal --delete
   ```

4. **Create CloudFront distribution** for CDN

5. **Update API URL** before building

## 6. DigitalOcean Deployment

### Using App Platform

1. **Connect GitHub repository**
2. **Configure backend**
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Environment Variables: Add DB credentials

3. **Configure frontend**
   - Build Command: `npm run build`
   - Environment Variables: Set API URL

4. **Deploy database** with DigitalOcean Managed MySQL

## 7. Production Checklist

- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Setup SSL certificate
- [ ] Configure Database backups
- [ ] Setup monitoring
- [ ] Configure logging
- [ ] Setup error tracking (Sentry)
- [ ] Enable rate limiting
- [ ] Setup CI/CD pipeline
- [ ] Test all features
- [ ] Test security
- [ ] Performance optimization
- [ ] Setup domain name
- [ ] Configure DNS

## 8. Environment Variables for Production

### Backend (.env)
```
DB_HOST=production-mysql-host
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_NAME=alumni_db
DB_PORT=3306
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```
REACT_APP_API_URL=https://api.yourdomain.com
```

## 9. Performance Optimization

### Backend
```bash
# Install compression middleware
npm install compression
```

Add to server.js:
```javascript
const compression = require('compression');
app.use(compression());
```

### Frontend
```bash
# Production build
npm run build

# Analyze bundle size
npm install -g serve
serve -s build
```

## 10. Monitoring & Logging

### Backend Logging
```bash
npm install winston
```

### Error Tracking
- Sentry
- LogRocket
- Rollbar

### Performance Monitoring
- New Relic
- Datadog
- AWS CloudWatch

## 11. CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install && npm test
      - run: cd frontend && npm install && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        run: |
          git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main
```

## 12. Backup & Recovery

### Database Backup
```bash
# Backup MySQL
mysqldump -u root -p alumni_db > backup.sql

# Restore
mysql -u root -p alumni_db < backup.sql
```

### Automated Backup
- Setup AWS RDS automated backups
- Configure DigitalOcean backup snapshots
- Schedule daily backups

## 13. Security Best Practices

1. **Use HTTPS everywhere**
2. **Environment variables** for secrets
3. **Input validation** on both ends
4. **SQL injection prevention** (using parameterized queries)
5. **CORS configuration** - whitelist domains
6. **Rate limiting** - prevent abuse
7. **Regular updates** - keep dependencies current
8. **Monitoring** - watch for suspicious activity

## 14. Troubleshooting Deployment

### Issue: Connection refused
- Verify database is running
- Check network security groups
- Verify credentials

### Issue: CORS errors
- Update frontend API URL
- Check backend CORS config
- Verify domains in whitelist

### Issue: 502 Bad Gateway
- Check backend logs
- Verify port configuration
- Check server resources

### Issue: Database locked
- Restart MySQL service
- Check active connections
- Review error logs

## Quick Deployment References

| Platform | Frontend | Backend | Database |
|----------|----------|---------|----------|
| Local | npm start | npm start | Local MySQL |
| Docker | Docker | Docker | Docker MySQL |
| Heroku | Netlify | Heroku | ClearDB |
| AWS | S3+CloudFront | EC2 | RDS |
| DigitalOcean | App Platform | App Platform | Managed MySQL |
| Vercel | Vercel | AWS Lambda | RDS |

---

**Choose your deployment platform and follow the corresponding guide above!**
