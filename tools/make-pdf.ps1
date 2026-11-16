# 사이트용 PDF 12개를 만든다: 전체 원페이저 1, 관점별 4(전체 포함), 프로젝트별 7.
# 미리 로컬 서버를 켠다: py -3.11 -m http.server 5173 (저장소 루트에서)
# 실행: powershell -ExecutionPolicy Bypass -File tools/make-pdf.ps1
param([string]$Base = "http://localhost:5173")

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "pdf"
$chrome = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "Chrome이나 Edge를 찾지 못했습니다. 설치 경로를 tools/make-pdf.ps1에 추가하세요." }
try { Invoke-WebRequest "$Base/index.html" -UseBasicParsing -TimeoutSec 5 | Out-Null }
catch { throw "로컬 서버($Base)에 연결하지 못했습니다. 저장소 루트에서 'py -3.11 -m http.server 5173'을 먼저 실행하세요." }

New-Item -ItemType Directory -Force $out | Out-Null
$jobs = [ordered]@{ "onepager-all.pdf" = "index.html?role=all&print=onepager" }
foreach ($r in "all", "ax", "data", "sw") { $jobs["role-$r.pdf"] = "index.html?role=$r&print=full" }
foreach ($p in "noti", "contest", "veriorder", "agentpool", "steel", "tw-web", "tw-mobile") { $jobs["project-$p.pdf"] = "project.html?id=$p&print=1" }

$profile = Join-Path $env:TEMP "portfolio-pdf-profile"
foreach ($name in $jobs.Keys) {
  $file = Join-Path $out $name
  $chromeArgs = @("--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--user-data-dir=$profile",
            "--virtual-time-budget=8000", "--print-to-pdf=$file", "$Base/$($jobs[$name])")
  # Chrome은 정상일 때도 확장 레지스트리 경고를 stderr에 쓰므로, 이 호출만 오류로 멈추지 않게 하고 결과 파일로 판단한다.
  $ErrorActionPreference = "Continue"
  & $chrome @chromeArgs 2>&1 | Out-Null
  $ErrorActionPreference = "Stop"
  if (-not (Test-Path $file)) { throw "$name 을 만들지 못했습니다. 주소: $Base/$($jobs[$name])" }
  Write-Output ("{0,-24} {1,6:N0} KB" -f $name, ((Get-Item $file).Length / 1KB))
}
