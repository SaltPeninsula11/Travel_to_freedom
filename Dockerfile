FROM python:3.8.6
RUN apt-get update && apt-get install -y \
    yarn \
    && pip install pipenv

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /Django