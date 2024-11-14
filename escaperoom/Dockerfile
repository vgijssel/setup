# trunk-ignore-all(checkov/CKV_DOCKER_2)
# trunk-ignore-all(checkov/CKV_DOCKER_3)
# trunk-ignore-all(trivy/DS002)
# trunk-ignore-all(trivy/DS026)
FROM python:3.10.8-slim

RUN pip3 install --no-cache-dir --upgrade \
    pip

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    software-properties-common \
    git

WORKDIR /opt/escaperoom

COPY requirements.txt .

RUN pip install -r ./requirements.txt

COPY . .

EXPOSE 8501

ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]