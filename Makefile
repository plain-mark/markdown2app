genexecutable:
	cp main.py markdown2app
	sed  -i '1i #!/usr/bin/python\n' markdown2app

install: genexecutable
	sudo cp markdown2app /usr/bin/
	sudo chmod +x /usr/bin/markdown2app
	rm markdown2app