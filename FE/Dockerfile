# 리액트 빌드
FROM node:20-alpine AS build

WORKDIR /app/

COPY ./package*.json /app

RUN npm config set registry https://registry.npmjs.org/

RUN npm install

WORKDIR /app/FE/

COPY ./FE/package*.json /app/FE/

RUN npm install

COPY ./FE /app/FE

COPY ./schemas /app/schemas

RUN npx vite build



# nginx 웹 서버 빌드
FROM nginx:1.24

RUN apt update && apt install -y build-essential libpcre3 libpcre3-dev zlib1g-dev libssl-dev git wget

WORKDIR /usr/local/src

RUN wget http://nginx.org/download/nginx-1.24.0.tar.gz && \
    tar -xzvf nginx-1.24.0.tar.gz

# ngx_cache_purge 모듈 다운로드
RUN git clone https://github.com/FRiCKLE/ngx_cache_purge.git

WORKDIR /usr/local/src/nginx-1.24.0

# Nginx 빌드 및 설치 
RUN ./configure --with-http_ssl_module --with-http_v2_module --with-http_realip_module \
    --with-http_stub_status_module --add-module=/usr/local/src/ngx_cache_purge && \
    make && make install

# 기존 Nginx 제거 및 새로 빌드한 Nginx 사용
RUN rm -rf /etc/nginx /usr/sbin/nginx && ln -s /usr/local/nginx/sbin/nginx /usr/sbin/nginx

RUN mkdir /usr/local/nginx/conf.d

COPY --from=build /app/FE/dist /usr/share/nginx/html

COPY ./FE/conf/nginx.conf /usr/local/nginx/conf/nginx.conf

COPY ./FE/conf/default.conf /usr/local/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
