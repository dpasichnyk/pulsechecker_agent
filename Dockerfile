FROM node:12.16.1-slim

ENV CURL_VERSION 7.74.0
ENV npm_config_curl_config_bin=curl-config
ENV npm_config_build_from_source=true

# RUN apk add --update --no-cache openssl openssl-dev nghttp2-dev ca-certificates
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get remove -y curl libcurl3
RUN apt-get install -y pkg-config zlib1g zlib1g-dev lib32z1-dev cmake ca-certificates libssl-dev build-essential python wget make g++
RUN wget https://github.com/google/brotli/archive/v1.0.9.tar.gz && \
    tar zxf v1.0.9.tar.gz && rm v1.0.9.tar.gz && cd brotli-1.0.9 && \
    mkdir out && cd out && ../configure-cmake && make && make test && make install && \
    cd ../.. && rm -rf brotli-1.0.9
RUN wget https://github.com/nghttp2/nghttp2/releases/download/v1.42.0/nghttp2-1.42.0.tar.gz && \
    tar zxf nghttp2-1.42.0.tar.gz && rm nghttp2-1.42.0.tar.gz && cd nghttp2-1.42.0 && \
    ./configure && make && make install && \
    cd .. && rm -rf nghttp2-1.42.0
RUN wget https://curl.haxx.se/download/curl-$CURL_VERSION.tar.bz2 && \
    tar xjf curl-$CURL_VERSION.tar.bz2 && \
    rm curl-$CURL_VERSION.tar.bz2 && \
    cd curl-$CURL_VERSION && \
    ldconfig && \
    ./configure \
        --with-nghttp2 \
        --prefix=/usr \
        --with-ssl \
        --enable-ipv6 \
        --with-brotli=/usr \
        --enable-unix-sockets \
        --without-libidn \
        --disable-static \
        --disable-ldap \
        --with-pic \
        --with-zlib && \
    make && \
    make install && \
    cd .. && \
    rm -rf curl-$CURL_VERSION
RUN rm -r /usr/share/man && \
    apt-get remove -y cmake build-essential && \
    apt-get autoremove -y && \
    apt-get clean -y

# RUN apk add --update --no-cache git openssl

ENV APP_DIR=/code
WORKDIR $APP_DIR

COPY package.json $APP_DIR
COPY yarn.lock $APP_DIR
RUN yarn install

RUN ls -la node_modules/@types

ADD . $APP_DIR
RUN yarn run build
