#!/usr/bin/env node

/**
 * Admin User Creation Script
 * 
 * This script helps you create an admin user for the Task Management System.
 * 
 * Usage:
 * 1. Make sure your backend is running
 * 2. Run: node scripts/create-admin.js
 * 3. Follow the prompts
 */

const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const API_BASE = process.env.API_BASE || 'http://localhost:4000';

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function createAdmin() {
    console.log('🚀 Admin User Creation Script');
    console.log('==============================\n');

    try {
        // Get user email
        const email = await question('Enter the email of the user to promote to admin: ');

        if (!email) {
            console.log('❌ Email is required');
            return;
        }

        // Optional secret key
        const useSecretKey = await question('Use secret key for additional security? (y/n): ');
        let secretKey = null;

        if (useSecretKey.toLowerCase() === 'y') {
            secretKey = await question('Enter the secret key: ');
        }

        // Prepare request data
        const data = JSON.stringify({
            email: email.trim(),
            ...(secretKey && { secretKey: secretKey.trim() })
        });

        // Make the API request
        const options = {
            hostname: new URL(API_BASE).hostname,
            port: new URL(API_BASE).port || 80,
            path: '/api/users/promote-admin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);

                    if (res.statusCode === 200) {
                        console.log('\n✅ Success!');
                        console.log(`User ${email} has been promoted to admin.`);
                        console.log('User details:', result.user);
                    } else {
                        console.log('\n❌ Error:', result.message);
                    }
                } catch (e) {
                    console.log('\n❌ Error parsing response:', responseData);
                }
            });
        });

        req.on('error', (error) => {
            console.log('\n❌ Request failed:', error.message);
            console.log('\n💡 Make sure your backend server is running on', API_BASE);
        });

        req.write(data);
        req.end();

    } catch (error) {
        console.log('\n❌ Script error:', error.message);
    } finally {
        rl.close();
    }
}

// Handle HTTP URLs
if (API_BASE.startsWith('http://')) {
    const http = require('http');
    const req = http.request;
    https.request = (options, callback) => {
        return req(options, callback);
    };
}

createAdmin();
