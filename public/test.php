<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

header('Content-Type: text/plain; charset=utf-8');

echo "=== FrameFusion Server Diagnostic ===\n\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server Software: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "\n";
echo "Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'Unknown') . "\n";
echo "Current File: " . __FILE__ . "\n";
echo "Current Dir: " . __DIR__ . "\n\n";

$baseDir = dirname(__DIR__);

echo "Checking Files & Folders in: " . $baseDir . "\n";
echo "----------------------------------------\n";
$checks = [
    'vendor/autoload.php' => $baseDir . '/vendor/autoload.php',
    '.env' => $baseDir . '/.env',
    '.env.example' => $baseDir . '/.env.example',
    'bootstrap/app.php' => $baseDir . '/bootstrap/app.php',
    'storage' => $baseDir . '/storage',
    'storage/framework' => $baseDir . '/storage/framework',
    'storage/framework/views' => $baseDir . '/storage/framework/views',
    'storage/logs' => $baseDir . '/storage/logs',
    'database/database.sqlite' => $baseDir . '/database/database.sqlite',
    'public/build/manifest.json' => __DIR__ . '/build/manifest.json',
];

foreach ($checks as $name => $path) {
    $exists = file_exists($path);
    $writable = $exists && is_writable($path);
    echo sprintf("%-30s: %s %s\n", $name, $exists ? '[EXISTS]' : '[MISSING]', $exists ? ($writable ? '(Writable)' : '(Read-Only)') : '');
}

echo "\nPHP Extensions:\n";
echo "----------------------------------------\n";
$exts = ['pdo', 'pdo_mysql', 'pdo_sqlite', 'gd', 'fileinfo', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'bcmath'];
foreach ($exts as $ext) {
    echo sprintf("%-15s: %s\n", $ext, extension_loaded($ext) ? '[ENABLED]' : '[MISSING]');
}

echo "\nAttempting Laravel Bootstrap:\n";
echo "----------------------------------------\n";
if (file_exists($baseDir . '/vendor/autoload.php')) {
    try {
        require $baseDir . '/vendor/autoload.php';
        $app = require_once $baseDir . '/bootstrap/app.php';
        echo "Laravel bootstrap SUCCESS!\n";
    } catch (\Throwable $e) {
        echo "Laravel bootstrap FAILED with exception:\n";
        echo $e->getMessage() . "\n";
        echo $e->getFile() . ":" . $e->getLine() . "\n";
        echo $e->getTraceAsString() . "\n";
    }
} else {
    echo "Cannot bootstrap Laravel: vendor/autoload.php is MISSING.\n";
}

echo "\nStorage & Frames Diagnostic:\n";
echo "----------------------------------------\n";
$pubStorage = __DIR__ . '/storage';
echo "public/storage type: " . (is_link($pubStorage) ? 'SYMLINK -> ' . readlink($pubStorage) : (is_dir($pubStorage) ? 'REAL DIRECTORY' : (file_exists($pubStorage) ? 'FILE' : 'DOES NOT EXIST'))) . "\n";

$storageAppPublic = $baseDir . '/storage/app/public';
echo "storage/app/public exists: " . (file_exists($storageAppPublic) ? 'YES' : 'NO') . "\n";

echo "\nFiles in public/storage/frames:\n";
$pubFrames = __DIR__ . '/storage/frames';
if (file_exists($pubFrames) && is_dir($pubFrames)) {
    $f = scandir($pubFrames);
    foreach ($f as $file) {
        if ($file === '.' || $file === '..') continue;
        $p = $pubFrames . '/' . $file;
        echo sprintf(" - %-35s (perm: %o, size: %d)\n", $file, fileperms($p) & 0777, filesize($p));
    }
} else {
    echo "Directory public/storage/frames does not exist!\n";
}

echo "\nFiles in storage/app/public/frames:\n";
$appFrames = $storageAppPublic . '/frames';
echo "\nDatabase Connection Diagnostic:\n";
echo "----------------------------------------\n";
try {
    $dbConn = \Illuminate\Support\Facades\DB::getDefaultConnection();
    $dbName = \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
    echo "Default DB Connection: $dbConn\n";
    echo "Database Name: $dbName\n";
    $campaignSlugs = \Illuminate\Support\Facades\DB::table('campaigns')->pluck('slug')->toArray();
    echo "Existing Campaigns (" . count($campaignSlugs) . "): " . implode(', ', $campaignSlugs) . "\n";
} catch (\Throwable $e) {
    echo "Database connection error: " . $e->getMessage() . "\n";
}

    echo "\nAuto-Syncing Frames between storage/app/public and public/storage:\n";
    echo "----------------------------------------\n";
    $appFrames = $storageAppPublic . '/frames';
    $pubFrames = __DIR__ . '/storage/frames';
    if (!file_exists($pubFrames)) {
        @mkdir($pubFrames, 0755, true);
    }
    if (file_exists($appFrames) && is_dir($appFrames)) {
        foreach (scandir($appFrames) as $file) {
            if ($file === '.' || $file === '..') continue;
            $src = $appFrames . '/' . $file;
            $dst = $pubFrames . '/' . $file;
            if (!file_exists($dst)) {
                $copied = @copy($src, $dst);
                @chmod($dst, 0644);
                echo "Copied to public: $file " . ($copied ? '[OK]' : '[FAILED]') . "\n";
            }
        }
    }
}

