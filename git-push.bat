COMMIT_TIMESTAMP=`date +'%Y-%m-%d %H:%M:%S %Z'`
git add .
git commit -m" commit at ${COMMIT_TIMESTAMP}"
if [ -n "$(git status - porcelain)" ];
then
 echo "IT IS CLEAN"
else
 git status
 echo "Pushing data to remote server!!!"
 git push -u origin master
fi