#!/bin/bash

# FlashcardApp EC2 User Data Script
# This script runs when the EC2 instance starts up

set -e

# Update system
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p /home/ec2-user/flashcards-app
cd /home/ec2-user/flashcards-app

# Create .env file with environment variables
cat > .env << 'ENVEOF'
DATABASE_URL=sqlite:///./data/flashcards.db
SECRET_KEY=${SECRET_KEY:-your-production-secret-key-change-this}
OPENAI_API_KEY=${OPENAI_API_KEY}
SERPAPI_KEY=${SERPAPI_KEY}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVEOF

# Create data directory
mkdir -p data

# Set proper permissions
chown -R ec2-user:ec2-user /home/ec2-user/flashcards-app

# Create a simple startup script
cat > /home/ec2-user/start-app.sh << 'SCRIPTEOF'
#!/bin/bash
cd /home/ec2-user/flashcards-app
docker-compose up -d
SCRIPTEOF

chmod +x /home/ec2-user/start-app.sh

# Start the application
cd /home/ec2-user/flashcards-app
docker-compose up -d

echo "FlashcardApp deployment completed!" 