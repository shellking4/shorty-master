FROM golang:1.23-alpine AS builder

WORKDIR /pb

COPY . .

RUN go build -o pocketbase

EXPOSE 8090

VOLUME ["/pb/pb_data"]

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]