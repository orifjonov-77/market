@echo off
cd /d "C:\Users\777 comp service\Desktop\mini market"
echo Vercel uchun yangilanishlarni GitHub'ga yuklash...
git add .
git commit -m "fix(build): configure vite build for Vercel deployment"
git push origin main
echo ------------------------------------------
echo Yuklandi! Vercel avtomatik ravishda qayta build qiladi (Success bo'ladi).
pause
