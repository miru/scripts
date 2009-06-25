#!/opt/local/bin/zsh
for FIL in `find . -name "*.sqlite"`
do
ls -al $FIL
sqlite3 $FIL "vacuum"
sqlite3 $FIL "reindex"
ls -la $FIL
echo ""
done

