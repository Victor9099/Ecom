[CmdletBinding()]
param(
    [string]$PaseoTeamDirectory = (Join-Path ([Environment]::GetFolderPath('UserProfile')) '.paseo-pi-team')
)

$ErrorActionPreference = 'Stop'

$localPath = Join-Path $PaseoTeamDirectory 'model-routing.local.json'
$clusterPath = Join-Path $PaseoTeamDirectory 'cluster-routing.local.json'

foreach ($path in @($localPath, $clusterPath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        throw "Required routing file is missing: $path"
    }
}

$local = Get-Content -Raw -LiteralPath $localPath | ConvertFrom-Json
$cluster = Get-Content -Raw -LiteralPath $clusterPath | ConvertFrom-Json
$clusterHost = $cluster.hosts.'local-windows'

if ($local.version -ne 1 -or $cluster.version -ne 1) {
    throw 'Only routing schema version 1 is approved.'
}

if ($local.hostId -ne 'local-windows' -or $null -eq $clusterHost) {
    throw 'The approved local-windows host mapping is missing.'
}

$expected = [ordered]@{
    MONITOR_ECONOMY = @('pi-supervisor', 'cliproxyapi/deepseek-v4-pro-0813', 'medium')
    FAST_READ      = @('pi-peer', 'cliproxyapi/qwen3.7-plus', 'low')
    CODING_MEDIUM  = @('pi-peer', 'cliproxyapi/qwen3.7-plus', 'medium')
    REASONING_HIGH = @('pi-peer', 'cliproxyapi/deepseek-v4-pro-0813', 'high')
    REVIEW_HIGH    = @('pi-peer', 'cliproxyapi/deepseek-v4-pro-0813', 'high')
}

$localNames = @($local.routes.PSObject.Properties.Name | Sort-Object)
$clusterNames = @($clusterHost.routes.PSObject.Properties.Name | Sort-Object)
$expectedNames = @($expected.Keys | Sort-Object)

if (Compare-Object $expectedNames $localNames) {
    throw 'The host-local route class set differs from the approved five-class matrix.'
}

if (Compare-Object $expectedNames $clusterNames) {
    throw 'The cluster route class set differs from the approved five-class matrix.'
}

foreach ($name in $expected.Keys) {
    $approved = $expected[$name]
    $localRoute = $local.routes.$name
    $clusterRoute = $clusterHost.routes.$name

    foreach ($route in @($localRoute, $clusterRoute)) {
        if (
            $route.paseoProvider -ne $approved[0] -or
            $route.model -ne $approved[1] -or
            $route.thinking -ne $approved[2]
        ) {
            throw "ROUTE_POLICY_MISMATCH: $name"
        }
    }

    Write-Output "PASS $name => $($approved -join ' / ')"
}

$localCanonical = $local.routes | ConvertTo-Json -Depth 20 -Compress
$clusterCanonical = $clusterHost.routes | ConvertTo-Json -Depth 20 -Compress

if ($localCanonical -ne $clusterCanonical) {
    throw 'ROUTE_SOURCE_DIVERGENCE: local and cluster route objects differ.'
}

Write-Output 'PASS local and cluster route objects are semantically equal.'
