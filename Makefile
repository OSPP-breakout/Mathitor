MQ = ./mathquill-master
SUBDIRS = $(MQ)

setup: 
	@cd $(MQ); make all


.PHONY: clean

clean-setup:
	for i in $(SUBDIRS) ; do \
	(cd $$i ; make -s --no-print-directory clean) ; \
	done