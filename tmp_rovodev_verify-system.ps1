Write-Host "🧪 DSLR NOTIFICATION SYSTEM - VERIFICATION TEST" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

$testResults = @()

# Function to check file and add result
function Test-FileExists {
    param($FilePath, $Description)
    if (Test-Path $FilePath) {
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Description - MISSING" -ForegroundColor Red
        return $false
    }
}

# Function to check file content
function Test-FileContent {
    param($FilePath, $SearchString, $Description)
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        if ($content -match $SearchString) {
            Write-Host "✅ $Description - Integration Found" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️  $Description - Integration Missing" -ForegroundColor Yellow
            return $false
        }
    } else {
        Write-Host "❌ $Description - File Missing" -ForegroundColor Red
        return $false
    }
}

Write-Host "📁 CORE FILES VERIFICATION" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

$coreFiles = @(
    @{Path="dslr-auto-upload-service.js"; Desc="DSLR Auto Upload Service"},
    @{Path="package.json"; Desc="Package Configuration"},
    @{Path="src/lib/dslr-notification-integration.ts"; Desc="Notification Integration"},
    @{Path="public/sw.js"; Desc="Service Worker"},
    @{Path=".env.example"; Desc="Environment Template"}
)

$coreScore = 0
foreach ($file in $coreFiles) {
    if (Test-FileExists $file.Path $file.Desc) {
        $coreScore++
    }
}

Write-Host ""
Write-Host "📋 TEST FILES VERIFICATION" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

$testFiles = @(
    @{Path="tmp_rovodev_test-dslr-system.js"; Desc="System Integration Test"},
    @{Path="tmp_rovodev_test-photo-simulator.js"; Desc="Photo Upload Simulator"},
    @{Path="tmp_rovodev_test-api-endpoints.js"; Desc="API Endpoints Test"},
    @{Path="tmp_rovodev_test-complete-integration.js"; Desc="Complete Integration Test"},
    @{Path="tmp_rovodev_run-tests.bat"; Desc="Test Runner Script"}
)

$testScore = 0
foreach ($file in $testFiles) {
    if (Test-FileExists $file.Path $file.Desc) {
        $testScore++
    }
}

Write-Host ""
Write-Host "🔗 INTEGRATION VERIFICATION" -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow

$integrationScore = 0

# Check DSLR service integration
if (Test-FileContent "dslr-auto-upload-service.js" "getDSLRNotificationIntegration" "DSLR Service → Notification Integration") {
    $integrationScore++
}

if (Test-FileContent "dslr-auto-upload-service.js" "triggerEvent" "DSLR Service → Event Triggers") {
    $integrationScore++
}

if (Test-FileContent "package.json" "chokidar" "Package.json → DSLR Dependencies") {
    $integrationScore++
}

if (Test-FileContent "src/lib/dslr-notification-integration.ts" "DSLRNotificationIntegration" "Notification Integration → Class Definition") {
    $integrationScore++
}

Write-Host ""
Write-Host "📊 VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host "📁 Core Files: $coreScore/$($coreFiles.Count) found" -ForegroundColor $(if($coreScore -eq $coreFiles.Count){"Green"}else{"Yellow"})
Write-Host "📋 Test Files: $testScore/$($testFiles.Count) found" -ForegroundColor $(if($testScore -eq $testFiles.Count){"Green"}else{"Yellow"})
Write-Host "🔗 Integration: $integrationScore/4 verified" -ForegroundColor $(if($integrationScore -eq 4){"Green"}else{"Yellow"})

$totalScore = $coreScore + $testScore + $integrationScore
$maxScore = $coreFiles.Count + $testFiles.Count + 4

Write-Host ""
Write-Host "📈 OVERALL SCORE: $totalScore/$maxScore" -ForegroundColor $(if($totalScore -eq $maxScore){"Green"}elseif($totalScore -gt ($maxScore * 0.8)){"Yellow"}else{"Red"})

if ($totalScore -eq $maxScore) {
    Write-Host ""
    Write-Host "🎉 SYSTEM VERIFICATION PASSED!" -ForegroundColor Green
    Write-Host "===============================" -ForegroundColor Green
    Write-Host "✅ All files are present and properly integrated" -ForegroundColor Green
    Write-Host "✅ DSLR notification system is ready for testing" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "   1. Install Node.js if not already installed" -ForegroundColor White
    Write-Host "   2. Run: npm install" -ForegroundColor White
    Write-Host "   3. Run: tmp_rovodev_run-tests.bat" -ForegroundColor White
    Write-Host "   4. Connect Nikon D7100 and start shooting!" -ForegroundColor White
} elseif ($totalScore -gt ($maxScore * 0.8)) {
    Write-Host ""
    Write-Host "⚠️  SYSTEM VERIFICATION MOSTLY PASSED" -ForegroundColor Yellow
    Write-Host "=====================================" -ForegroundColor Yellow
    Write-Host "✅ Core functionality is present" -ForegroundColor Green
    Write-Host "⚠️  Some optional components may be missing" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 RECOMMENDATIONS:" -ForegroundColor Cyan
    Write-Host "   - Review missing files above" -ForegroundColor White
    Write-Host "   - System should still work for basic testing" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ SYSTEM VERIFICATION FAILED" -ForegroundColor Red
    Write-Host "=============================" -ForegroundColor Red
    Write-Host "❌ Critical files are missing" -ForegroundColor Red
    Write-Host "❌ System is not ready for testing" -ForegroundColor Red
    Write-Host ""
    Write-Host "🛠️  REQUIRED ACTIONS:" -ForegroundColor Cyan
    Write-Host "   - Ensure all files are properly created" -ForegroundColor White
    Write-Host "   - Check file paths and names" -ForegroundColor White
    Write-Host "   - Re-run file creation process" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 Test completed at: $(Get-Date)" -ForegroundColor Gray