# PowerShell script to start Vite server on Windows
Write-Host "Starting Vite development server..." -ForegroundColor Green

# Change to project directory
Set-Location "C:\WebApp_Project\ColoringBookMaker"

# Check if Node.js is installed
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Node.js found, starting Vite..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
}

Read-Host "Press Enter to exit..."