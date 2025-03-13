FROM python:3.9-slim

RUN python -m pip install --no-cache-dir --upgrade pip

WORKDIR /app

COPY . .

RUN python -m pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "api.py"]