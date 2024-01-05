FROM ubuntu:18.04
COPY ./dist/oimi-tk-linux-x64 /app/
WORKDIR /app
CMD chmod +x oimi-tk-linux-x64
EXPOSE 3000

ENTRYPOINT ["./oimi-tk-linux-x64"]