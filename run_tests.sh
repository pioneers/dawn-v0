set -ev
echo 2
./node_modules/karma/bin/karma start --browsers NodeWebkit test/karma.conf.js \
--single-run --log-level=debug
echo 4
exit
