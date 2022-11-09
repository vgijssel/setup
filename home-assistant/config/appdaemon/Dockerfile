FROM acockburn/appdaemon:4.2.1

# From https://gist.github.com/orenitamar/f29fb15db3b0d13178c1c4dd611adce2?permalink_comment_id=3710562#gistcomment-3710562
RUN echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/main" > /etc/apk/repositories
RUN echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/community" >> /etc/apk/repositories
RUN apk --no-cache --update-cache add gcc gfortran build-base wget freetype-dev libpng-dev openblas-dev
RUN ln -s /usr/include/locale.h /usr/include/xlocale.h

ADD /apps/ad-espresense-ips/requirements.txt .
RUN pip install -r requirements.txt
