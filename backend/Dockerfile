FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    curl \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Download the latest installer
ADD https://astral.sh/uv/0.5.14/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"

RUN curl -fsSL https://ollama.com/install.sh | sh

RUN ollama start & \
    sleep 5 && \
    ollama run deepseek-r1:1.5b && \
    kill $(pgrep ollama)

ADD ./app /app

WORKDIR /app

RUN echo ls

RUN uv sync --frozen

EXPOSE 8000

CMD ["sh", "-c", "exec ollama serve & uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload"]
