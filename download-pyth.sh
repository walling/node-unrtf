#!/bin/bash

set -e # exit on errors

rm -r pyth || true

curl -s 'https://pypi.python.org/packages/source/p/pyth/pyth-0.6.0.tar.gz' | tar xj pyth-0.6.0/pyth
mv pyth-0.6.0/pyth .
rmdir pyth-0.6.0

rm -r pyth/plugins/latex pyth/plugins/pdf pyth/plugins/plaintext pyth/plugins/python pyth/plugins/rst
rm pyth/plugins/rtf15/writer.py pyth/plugins/xhtml/css.py pyth/plugins/xhtml/reader.py

find pyth -type f -print
