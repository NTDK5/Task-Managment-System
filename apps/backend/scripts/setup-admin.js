#!/usr/bin/env node

/**
 * Direct Admin Setup Script
 * 
 * This script directly updates the database to create an admin user.
 * 
 * Usage:
 * 1. Navigate to backend directory: cd apps/backend
 * 2. Run: node scripts/setup-admin.js
 * 3. Follow the prompts
 */

const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setupAdmin() {
    console.log('🚀 Direct Admin Setup Script');
    console.log('=============================\n');

    try {
        // Get user email
        const email = await question('Enter the email of the user to promote to admin: ');

        if (!email) {
            console.log('❌ Email is required');
            return;
        }

        console.log('\n🔍 Looking for user...');

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: email.trim() }
        });

        if (!user) {
            console.log('❌ User not found with that email');
            return;
        }

        console.log(`✅ Found user: ${user.name || 'No name'} (${user.email})`);
        console.log(`Current role: ${user.role}`);

        if (user.role === 'ADMIN') {
            console.log('ℹ️  User is already an admin');
            return;
        }

        // Confirm the action
        const confirm = await question('\nPromote this user to admin? (y/n): ');

        if (confirm.toLowerCase() !== 'y') {
            console.log('❌ Operation cancelled');
            return;
        }

        // Update the user
        console.log('\n🔄 Updating user role...');

        const updatedUser = await prisma.user.update({
            where: { email: email.trim() },
            data: { role: 'ADMIN' }
        });

        console.log('\n✅ Success!');
        console.log(`User ${updatedUser.email} is now an admin`);
        console.log('User details:', {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role
        });

    } catch (error) {
        console.log('\n❌ Error:', error.message);

        if (error.code === 'P2002') {
            console.log('💡 This usually means the email already exists');
        }
    } finally {
        await prisma.$disconnect();
        rl.close();
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n\n👋 Goodbye!');
    await prisma.$disconnect();
    process.exit(0);
});

setupAdmin();
