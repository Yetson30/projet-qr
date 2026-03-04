@echo off
setlocal

set "HERE=%~dp0"
cd /d "%HERE%"

echo Demarrage du serveur local (PowerShell)...
echo.
echo Si une fenetre de securite apparait, autorise sur "Reseaux prives".
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%HERE%serve.ps1"

endlocal

