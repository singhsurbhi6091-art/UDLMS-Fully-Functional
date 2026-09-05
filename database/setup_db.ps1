# PowerShell script to initialize udlms_db in PostgreSQL
param (
    [string]$DbUser = "postgres",
    [string]$DbName = "udlms_db",
    [string]$HostName = "localhost",
    [string]$Port = "5432"
)

if (-not $env:PGPASSWORD) {
    $env:PGPASSWORD = "1234"
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  UDLMS Database Initialization Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if database exists, if not create it
Write-Host "Checking / Creating database '$DbName'..." -ForegroundColor Yellow
$exists = & psql -h $HostName -p $Port -U $DbUser -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DbName';" | Select-String "1" -Quiet

if (-not $exists) {
    Write-Host "Creating database '$DbName'..." -ForegroundColor Green
    & psql -h $HostName -p $Port -U $DbUser -d postgres -c "CREATE DATABASE $DbName;"
} else {
    Write-Host "Database '$DbName' already exists." -ForegroundColor Green
}

# Run Schema
Write-Host "Applying database schema (database/schema.sql)..." -ForegroundColor Yellow
& psql -h $HostName -p $Port -U $DbUser -d $DbName -f "database\schema.sql"

# Run Seeds
Write-Host "Seeding initial prototype records (database/seed.sql)..." -ForegroundColor Yellow
& psql -h $HostName -p $Port -U $DbUser -d $DbName -f "database\seed.sql"

Write-Host "`nDatabase setup complete! Tables created successfully in '$DbName'." -ForegroundColor Green
