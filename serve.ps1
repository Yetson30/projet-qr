$ErrorActionPreference = 'Stop'

function Get-ContentType([string]$path) {
  $ext = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
  switch ($ext) {
    '.html' { return 'text/html; charset=utf-8' }
    '.htm'  { return 'text/html; charset=utf-8' }
    '.css'  { return 'text/css; charset=utf-8' }
    '.js'   { return 'application/javascript; charset=utf-8' }
    '.json' { return 'application/json; charset=utf-8' }
    '.svg'  { return 'image/svg+xml' }
    '.png'  { return 'image/png' }
    '.jpg'  { return 'image/jpeg' }
    '.jpeg' { return 'image/jpeg' }
    '.gif'  { return 'image/gif' }
    '.webp' { return 'image/webp' }
    '.pdf'  { return 'application/pdf' }
    '.woff' { return 'font/woff' }
    '.woff2'{ return 'font/woff2' }
    '.ttf'  { return 'font/ttf' }
    default { return 'application/octet-stream' }
  }
}

function Write-TextResponse($ctx, [int]$statusCode, [string]$text) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
  $ctx.Response.StatusCode = $statusCode
  $ctx.Response.ContentType = 'text/plain; charset=utf-8'
  $ctx.Response.ContentLength64 = $bytes.Length
  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $ctx.Response.OutputStream.Close()
}

$root = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$port = 8000
$prefix = "http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
} catch {
  Write-Host "Impossible de démarrer le serveur sur $prefix"
  Write-Host "Erreur: $($_.Exception.Message)"
  Write-Host ""
  Write-Host "Astuce: change le port (8001, 8080) ou ferme l'appli qui l'utilise déjà."
  exit 1
}

Write-Host "Serveur local démarré: $prefix"
Write-Host "Ouvre: ${prefix}template-preview.html"
Write-Host "Arrêter: Ctrl+C"
Write-Host ""

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    try {
      $rawPath = $req.Url.AbsolutePath
      $rel = [Uri]::UnescapeDataString($rawPath.TrimStart('/'))
      if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }

      # Prevent path traversal
      $combined = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $rel))
      if (-not $combined.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        Write-TextResponse $ctx 403 '403 Forbidden'
        continue
      }

      if (-not (Test-Path -LiteralPath $combined -PathType Leaf)) {
        Write-TextResponse $ctx 404 "404 Not Found: /$rel"
        continue
      }

      $bytes = [System.IO.File]::ReadAllBytes($combined)
      $res.StatusCode = 200
      $res.ContentType = Get-ContentType $combined
      $res.AddHeader('Cache-Control', 'no-cache')
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.OutputStream.Close()
    } catch {
      try {
        Write-TextResponse $ctx 500 ("500 Server Error`n" + $_.Exception.Message)
      } catch { }
    }
  }
} finally {
  
}

