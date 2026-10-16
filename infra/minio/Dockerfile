FROM public.ecr.aws/docker/library/golang:1.24.8-bookworm AS builder
ENV CGO_ENABLED=0 GOMEMLIMIT=512MiB GOFLAGS=-p=2
RUN go install github.com/minio/minio@RELEASE.2025-10-15T17-29-55Z

FROM public.ecr.aws/docker/library/python:3.13.16-slim-bookworm
COPY --from=builder /go/bin/minio /usr/local/bin/minio
RUN useradd --uid 10001 --create-home minio && mkdir /data && chown minio:minio /data
USER 10001
EXPOSE 9000 9001
ENTRYPOINT ["minio"]
CMD ["server", "/data", "--console-address", ":9001"]
