MQ = ./mathquill-master
SRC = ./src
SUBDIRS = $(MQ) $(SRC)

all:
	@cd $(SRC); rm -f script.js
	@cd $(SRC); tsc script.ts


setup: 
	@cd $(MQ); make all


.PHONY: clean

clean:
	@cd $(SRC); rm -f script.js

clean-setup:
	for i in $(SUBDIRS) ; do \
	(cd $$i ; make -s --no-print-directory clean) ; \
	done