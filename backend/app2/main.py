import ollama
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from loguru import logger


# Initiate FastAPI
app = FastAPI()

allowed_origins = ["http://localhost:3000"]

# Fast API MiddleWare
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model for the API input
class PromptRequest(BaseModel):
    model: str = "llama3.2:1b"
    prompt: str

# Helper function to interact with ollama
async def generate_response(model: str, 
                            prompt: str) -> str:
                            
    try:
        # Call ollama's chat function and stream the response
        stream = ollama.chat(
            model=model,
            messages=[{'role': 'user', 'content': prompt}],
            stream=True
        )

        response_text = ""
        # Collect the streamed content
        for chunk in stream:
            response_text += chunk['message']['content']

        return response_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {e}")

@app.post("/generate")
async def generate_text(request: PromptRequest):
    model = "llama3.2:1b"
    prompt = request.prompt

    logger.info(f"Generating Text with Model: {model} and Prompt: {prompt}")


    # Generate the response using the helper function
    response = await generate_response(model, prompt)

    logger.info(f"Received Response: {response}")


    return {"text": response}


