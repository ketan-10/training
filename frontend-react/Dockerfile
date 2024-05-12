FROM nginx:latest

COPY ./dist /usr/share/nginx/html/training
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

