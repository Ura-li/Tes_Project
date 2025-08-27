@echo off

start "test-vite" cmd /k "cd /d test-vite && npm run dev"

start "next-api" cmd /k "cd /d next-api && npm run dev"
