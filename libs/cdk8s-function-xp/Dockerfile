# Crossplane function container for cdk8s rendering
FROM python:3.11-slim

# Install uv for fast dependency installation
RUN pip install --no-cache-dir uv==0.1.9

# Set working directory
WORKDIR /function

# Copy requirements and install dependencies
COPY src/requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

# Copy function code
COPY src/function.py .
COPY src/cdk8s_renderer.py .

# Set entrypoint
ENTRYPOINT ["python", "/function/function.py"]
