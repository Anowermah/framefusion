<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeSuperAdminCommand extends Command
{
    protected $signature = 'user:super-admin {email? : The email of the user to promote}';
    protected $description = 'Promote a user to Super Admin with full control over the entire platform';

    public function handle(): int
    {
        $email = $this->argument('email');

        if (!$email) {
            // Find User ID 1 as default
            $user = User::find(1) ?? User::first();
            if (!$user) {
                $this->error('No users found in database.');
                return Command::FAILURE;
            }
        } else {
            $user = User::where('email', $email)->first();
            if (!$user) {
                $this->error("User with email [{$email}] was not found.");
                return Command::FAILURE;
            }
        }

        $user->role = 'super_admin';
        $user->status = 'active';
        $user->save();

        $this->info("Successfully promoted user [{$user->name}] ({$user->email}) to Super Admin (👑 super_admin).");
        $this->info("This user now has complete administrative control over the platform.");

        return Command::SUCCESS;
    }
}
