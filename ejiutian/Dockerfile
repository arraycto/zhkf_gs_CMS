FROM harbor01.cmcc.com/jt-ecloud-test/tomcat:v8.5
MAINTAINER xuhuiqun "xuhuiqun@chinamobile.com"


ENV BASE_DIR="/usr/local/tomcat"

WORKDIR /$BASE_DIR

#ADD dist/ webapps/znjhweb/
ADD dist/ webapps/ROOT/
ADD error.html webapps/ROOT/
ADD error.txt .

RUN sed -i '$d' conf/web.xml \
	&& cat error.txt >> conf/web.xml \
	&& rm error.txt

ENTRYPOINT ["/usr/local/tomcat/bin/catalina.sh","run"]
