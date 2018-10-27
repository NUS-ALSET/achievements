
import sys
import time
import traceback
import javascript

from browser import document as doc, window, alert, console

def createFunctionFromPython(string):
	try:
		exec(string+"""
window.getPlayersCommands = getPlayersCommands""")
	except Exception as e:
		return str(e)
	else:
		return 0
window.createFunctionFromPython=createFunctionFromPython;