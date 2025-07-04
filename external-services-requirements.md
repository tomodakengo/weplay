# External Services Requirements

## Overview
This document outlines the external service requirements for the project.

## Required Services

### Database
- **Service**: Supabase
- **Purpose**: Primary database for application data storage

### User Authentication
- **Service**: Supabase
- **Purpose**: Handle user registration, login, and authentication

### Billing/Payment Processing
- **Service**: Stripe
- **Purpose**: Handle subscription billing and payment processing

### Storage
- **Service**: Supabase
- **Purpose**: File storage and management

## Deployment Requirements

### Backend Deployment
- **Platform**: Vercel
- **Purpose**: Host and deploy the backend application

## Services NOT to Use
- AWS S3 (Storage will be handled by Supabase)
- MongoDB (Database will be handled by Supabase)

## Architecture Notes
- All services integrate well with Vercel deployment
- Supabase provides a unified solution for database, authentication, and storage
- Stripe integrates seamlessly with modern web applications
- This stack provides a serverless-first approach suitable for Vercel deployment