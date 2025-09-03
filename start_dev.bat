@echo off

start "test-vite" cmd /k "cd /d test-vite && npm run dev"

start "next-api" cmd /k "cd /d next-api && npm run dev"

start "server" cmd /k "cd /d server && node server.mjs"

ssh -L 3307:127.0.0.1:3306 dev_javag@160.19.166.229 
