#!/bin/bash

# FlashcardApp AWS Configuration Script
# This script helps configure AWS deployment settings

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check AWS CLI configuration
check_aws_config() {
    print_header "Checking AWS Configuration"
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first:"
        echo "  https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_status "AWS CLI is configured"
    
    # Get current AWS account and region
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    REGION=$(aws configure get region)
    print_status "AWS Account: $ACCOUNT_ID"
    print_status "AWS Region: $REGION"
}

# List available key pairs
list_key_pairs() {
    print_header "Available Key Pairs"
    
    aws ec2 describe-key-pairs --query 'KeyPairs[*].[KeyName,KeyFingerprint]' --output table
    
    if [ $? -ne 0 ]; then
        print_error "Failed to list key pairs"
        exit 1
    fi
}

# List available VPCs and subnets
list_vpc_subnets() {
    print_header "Available VPCs and Subnets"
    
    echo "VPCs:"
    aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,CidrBlock,Tags[?Key==`Name`].Value|[0]]' --output table
    
    echo ""
    echo "Subnets:"
    aws ec2 describe-subnets --query 'Subnets[*].[SubnetId,CidrBlock,AvailabilityZone,Tags[?Key==`Name`].Value|[0]]' --output table
}

# Create key pair
create_key_pair() {
    print_header "Creating Key Pair"
    
    read -p "Enter key pair name: " KEY_NAME
    
    if [ -z "$KEY_NAME" ]; then
        print_error "Key pair name cannot be empty"
        exit 1
    fi
    
    # Check if key pair already exists
    if aws ec2 describe-key-pairs --key-names "$KEY_NAME" &> /dev/null; then
        print_warning "Key pair '$KEY_NAME' already exists"
        return
    fi
    
    # Create key pair
    aws ec2 create-key-pair --key-name "$KEY_NAME" --query 'KeyMaterial' --output text > "$KEY_NAME.pem"
    chmod 400 "$KEY_NAME.pem"
    
    print_status "Key pair '$KEY_NAME' created successfully"
    print_status "Private key saved to: $KEY_NAME.pem"
    print_warning "Keep this file secure and don't commit it to version control!"
}

# Create VPC and subnet
create_vpc_subnet() {
    print_header "Creating VPC and Subnet"
    
    read -p "Enter VPC name: " VPC_NAME
    read -p "Enter VPC CIDR block (default: 10.0.0.0/16): " VPC_CIDR
    VPC_CIDR=${VPC_CIDR:-10.0.0.0/16}
    
    # Create VPC
    VPC_ID=$(aws ec2 create-vpc --cidr-block "$VPC_CIDR" --query 'Vpc.VpcId' --output text)
    aws ec2 create-tags --resources "$VPC_ID" --tags "Key=Name,Value=$VPC_NAME"
    
    # Create Internet Gateway
    IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
    aws ec2 attach-internet-gateway --vpc-id "$VPC_ID" --internet-gateway-id "$IGW_ID"
    
    # Create route table
    ROUTE_TABLE_ID=$(aws ec2 create-route-table --vpc-id "$VPC_ID" --query 'RouteTable.RouteTableId' --output text)
    aws ec2 create-route --route-table-id "$ROUTE_TABLE_ID" --destination-cidr-block 0.0.0.0/0 --gateway-id "$IGW_ID"
    
    # Get default subnet CIDR
    SUBNET_CIDR=$(echo "$VPC_CIDR" | sed 's/\.0\/16$/.0\/24/')
    read -p "Enter subnet CIDR block (default: $SUBNET_CIDR): " SUBNET_CIDR_INPUT
    SUBNET_CIDR=${SUBNET_CIDR_INPUT:-$SUBNET_CIDR}
    
    # Get availability zone
    AZ=$(aws ec2 describe-availability-zones --query 'AvailabilityZones[0].ZoneName' --output text)
    
    # Create subnet
    SUBNET_ID=$(aws ec2 create-subnet --vpc-id "$VPC_ID" --cidr-block "$SUBNET_CIDR" --availability-zone "$AZ" --query 'Subnet.SubnetId' --output text)
    aws ec2 create-tags --resources "$SUBNET_ID" --tags "Key=Name,Value=${VPC_NAME}-subnet"
    
    # Associate route table with subnet
    aws ec2 associate-route-table --subnet-id "$SUBNET_ID" --route-table-id "$ROUTE_TABLE_ID"
    
    # Enable auto-assign public IP
    aws ec2 modify-subnet-attribute --subnet-id "$SUBNET_ID" --map-public-ip-on-launch
    
    print_status "VPC created: $VPC_ID"
    print_status "Subnet created: $SUBNET_ID"
    print_status "Internet Gateway: $IGW_ID"
}

# Generate deployment configuration
generate_config() {
    print_header "Generating Deployment Configuration"
    
    # Get current values
    CURRENT_REGION=$(aws configure get region)
    CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    
    # Prompt for configuration
    read -p "Enter EC2 key pair name: " EC2_KEY_NAME
    read -p "Enter EC2 region (default: $CURRENT_REGION): " EC2_REGION
    EC2_REGION=${EC2_REGION:-$CURRENT_REGION}
    read -p "Enter EC2 instance type (default: t3.medium): " EC2_INSTANCE_TYPE
    EC2_INSTANCE_TYPE=${EC2_INSTANCE_TYPE:-t3.medium}
    read -p "Enter subnet ID: " EC2_SUBNET_ID
    
    # Create configuration file
    cat > .aws-deploy.env << EOF
# AWS Deployment Configuration
EC2_KEY_NAME=$EC2_KEY_NAME
EC2_REGION=$EC2_REGION
EC2_INSTANCE_TYPE=$EC2_INSTANCE_TYPE
EC2_SUBNET_ID=$EC2_SUBNET_ID

# API Keys (set these as environment variables)
# OPENAI_API_KEY=your-openai-api-key
# SERPAPI_KEY=your-serpapi-key

# Optional: Security Group ID (leave empty to create automatically)
# EC2_SECURITY_GROUP=
EOF
    
    print_status "Configuration saved to .aws-deploy.env"
    print_warning "Please set your API keys as environment variables before deployment:"
    echo "  export OPENAI_API_KEY=your-openai-api-key"
    echo "  export SERPAPI_KEY=your-serpapi-key"
}

# Main menu
show_menu() {
    echo ""
    print_header "FlashcardApp AWS Configuration"
    echo "1. Check AWS Configuration"
    echo "2. List Key Pairs"
    echo "3. Create Key Pair"
    echo "4. List VPCs and Subnets"
    echo "5. Create VPC and Subnet"
    echo "6. Generate Deployment Configuration"
    echo "7. Exit"
    echo ""
}

# Main function
main() {
    while true; do
        show_menu
        read -p "Select an option (1-7): " choice
        
        case $choice in
            1)
                check_aws_config
                ;;
            2)
                list_key_pairs
                ;;
            3)
                create_key_pair
                ;;
            4)
                list_vpc_subnets
                ;;
            5)
                create_vpc_subnet
                ;;
            6)
                generate_config
                ;;
            7)
                print_status "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid option. Please select 1-7."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main "$@" 