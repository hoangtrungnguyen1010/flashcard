#!/bin/bash

# FlashcardApp AWS Deployment Script
# This script deploys the application to an AWS EC2 instance

set -e

# Configuration
EC2_INSTANCE_ID=""
EC2_KEY_NAME=""
EC2_REGION="us-east-1"
EC2_INSTANCE_TYPE="t3.medium"
EC2_SECURITY_GROUP=""
EC2_SUBNET_ID=""
EC2_AMI_ID="ami-0c02fb55956c7d316"  # Amazon Linux 2023 AMI

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
}

# Create EC2 instance
create_ec2_instance() {
    print_status "Creating EC2 instance..."
    
    # Create security group if not exists
    if [ -z "$EC2_SECURITY_GROUP" ]; then
        print_status "Creating security group..."
        EC2_SECURITY_GROUP=$(aws ec2 create-security-group \
            --group-name flashcards-app-sg \
            --description "Security group for FlashcardApp" \
            --region $EC2_REGION \
            --query 'GroupId' --output text)
        
        # Add rules
        aws ec2 authorize-security-group-ingress \
            --group-id $EC2_SECURITY_GROUP \
            --protocol tcp \
            --port 22 \
            --cidr 0.0.0.0/0 \
            --region $EC2_REGION
        
        aws ec2 authorize-security-group-ingress \
            --group-id $EC2_SECURITY_GROUP \
            --protocol tcp \
            --port 80 \
            --cidr 0.0.0.0/0 \
            --region $EC2_REGION
        
        aws ec2 authorize-security-group-ingress \
            --group-id $EC2_SECURITY_GROUP \
            --protocol tcp \
            --port 443 \
            --cidr 0.0.0.0/0 \
            --region $EC2_REGION
        
        aws ec2 authorize-security-group-ingress \
            --group-id $EC2_SECURITY_GROUP \
            --protocol tcp \
            --port 8000 \
            --cidr 0.0.0.0/0 \
            --region $EC2_REGION
    fi
    
    # Create EC2 instance
    EC2_INSTANCE_ID=$(aws ec2 run-instances \
        --image-id $EC2_AMI_ID \
        --count 1 \
        --instance-type $EC2_INSTANCE_TYPE \
        --key-name $EC2_KEY_NAME \
        --security-group-ids $EC2_SECURITY_GROUP \
        --subnet-id $EC2_SUBNET_ID \
        --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=FlashcardApp}]' \
        --region $EC2_REGION \
        --query 'Instances[0].InstanceId' --output text)
    
    print_status "EC2 instance created: $EC2_INSTANCE_ID"
    
    # Wait for instance to be running
    print_status "Waiting for instance to be running..."
    aws ec2 wait instance-running --instance-ids $EC2_INSTANCE_ID --region $EC2_REGION
    
    # Get public IP
    PUBLIC_IP=$(aws ec2 describe-instances \
        --instance-ids $EC2_INSTANCE_ID \
        --region $EC2_REGION \
        --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
    
    print_status "Instance is running at: $PUBLIC_IP"
}

# Deploy application to EC2
deploy_to_ec2() {
    local PUBLIC_IP=$1
    
    print_status "Deploying application to EC2 instance..."
    
    # Create deployment script with proper environment variable handling
    cat > deploy_remote.sh << EOF
#!/bin/bash
set -e

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p /home/ec2-user/flashcards-app
cd /home/ec2-user/flashcards-app

# Create .env file with environment variables
cat > .env << 'ENVEOF'
DATABASE_URL=sqlite:///./data/flashcards.db
SECRET_KEY=your-production-secret-key-change-this
OPENAI_API_KEY=$OPENAI_API_KEY
SERPAPI_KEY=$SERPAPI_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVEOF

# Create data directory
mkdir -p data

# Pull and run the application
docker-compose up -d

echo "Application deployed successfully!"
EOF
    
    # Copy files to EC2
    print_status "Copying files to EC2 instance..."
    scp -i ~/.ssh/$EC2_KEY_NAME.pem -o StrictHostKeyChecking=no deploy_remote.sh ec2-user@$PUBLIC_IP:~/
    scp -i ~/.ssh/$EC2_KEY_NAME.pem -o StrictHostKeyChecking=no -r server/flashcards-api ec2-user@$PUBLIC_IP:~/flashcards-app/
    
    # Execute deployment script
    print_status "Executing deployment script..."
    ssh -i ~/.ssh/$EC2_KEY_NAME.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP "chmod +x deploy_remote.sh && ./deploy_remote.sh"
    
    print_status "Deployment completed successfully!"
    print_status "Application is available at: http://$PUBLIC_IP:8000"
    print_status "API documentation: http://$PUBLIC_IP:8000/docs"
}

# Main deployment function
main() {
    print_status "Starting FlashcardApp AWS deployment..."
    
    # Check prerequisites
    check_aws_cli
    check_docker
    
    # Check required environment variables
    if [ -z "$EC2_KEY_NAME" ]; then
        print_error "EC2_KEY_NAME is not set. Please set it to your AWS key pair name."
        exit 1
    fi
    
    if [ -z "$EC2_SUBNET_ID" ]; then
        print_error "EC2_SUBNET_ID is not set. Please set it to your AWS subnet ID."
        exit 1
    fi
    
    if [ -z "$OPENAI_API_KEY" ] || [ -z "$SERPAPI_KEY" ]; then
        print_error "OPENAI_API_KEY and SERPAPI_KEY must be set as environment variables."
        exit 1
    fi
    
    # Create EC2 instance
    create_ec2_instance
    
    # Deploy application
    deploy_to_ec2 $PUBLIC_IP
    
    print_status "Deployment completed!"
    print_status "Instance ID: $EC2_INSTANCE_ID"
    print_status "Public IP: $PUBLIC_IP"
    print_status "Application URL: http://$PUBLIC_IP:8000"
}

# Run main function
main "$@" 