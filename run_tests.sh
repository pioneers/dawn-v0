set -ev
echo 2
./node_modules/karma/bin/karma start --single-run --browsers NodeWebkit test/karma.conf.js
echo 4
exit
