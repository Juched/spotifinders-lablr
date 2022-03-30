FROM arm32v7/python:3.7.10-buster

ADD . /code
WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 80

RUN pip install -r requirements.txt 
CMD gunicorn --bind 0.0.0.0:$PORT app:app
