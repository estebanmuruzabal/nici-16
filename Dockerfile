FROM ubuntu:16.04

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    nano \
    supervisor

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# Improve cache invalidations by only running npm if requirements have indeed changed
WORKDIR /app
COPY package.json /app/
RUN npm install

# Supervisor settings
COPY docker/supervisord.conf /etc/supervisor/conf.d/simple-store.conf

# Application source code
COPY config/ /app/config
COPY src/ /app/src
COPY static/ /app/static
RUN rm -rf /app/static/dist
COPY webpack/ /app/webpack
COPY index.js /app/
RUN npm run build

# Expose application server port
EXPOSE 3000

CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf", "-n"]
