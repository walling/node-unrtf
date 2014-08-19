
from pyth.plugins.rtf15.reader import Rtf15Reader
from pyth.plugins.xhtml.writer import XHTMLWriter
from StringIO import StringIO
import json
import sys

while True:
	try:
		line = sys.stdin.readline()
	except KeyboardInterrupt:
		break

	try:
		rtf = json.loads(line.strip())
		doc = Rtf15Reader.read(StringIO(rtf))
		html = XHTMLWriter.write(doc).read()
		print json.dumps({ 'html': html })
	except Exception, e:
		print json.dumps({ 'error': unicode(e) })
	sys.stdout.flush()
