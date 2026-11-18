@echo off
cd /d "C:\Users\777 comp service\Desktop\mini market"
echo 1. O'zgarishlarni qo'shish...
git add .
echo 2. Yangi commit yaratish...
git commit -m "feat(ui): add floating cart button, mobile drawer and 100% brand clarity"
echo 3. GitHub'ga push qilish...
git push origin main
echo -------------------------------------------------------------
echo Yuklandi! Vercel avtomatik ravishda yangi versiyani joylaydi.
pause
