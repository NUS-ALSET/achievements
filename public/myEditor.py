
import sys
import time
import traceback
import javascript

from browser import document as doc, window, alert

from browser import document, alert, console

def createFunctionFromPython(string):
	try:
		exec(string+"""
window.getPlayersCommands = getPlayersCommands""")
	except Exception as e:
		alert(e)
		return 1
	else:
		return 0
window.createFunctionFromPython=createFunctionFromPython;