import ollama
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from loguru import logger


# Model for the API input
class PromptRequest(BaseModel):
    model: str = "deepseek-r1:1.5b" # Default model
    prompt: str

# Initiate FastAPI
app = FastAPI()

# CORS configuration
cors_config = {
    "allow_origins": ["http://localhost:3000"],
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

# Fast API MiddleWare
app.add_middleware(CORSMiddleware, **cors_config)


# Helper function to interact with ollama
async def generate_response(model: str, 
                            prompt: str) -> str:
    """
    Generate a response from the specified model based on the provided prompt.

    This function interacts with the ollama API to generate a text response
    by sending the user's prompt to the specified model and streaming the response.

    Args:
        model (str): The name of the model to use for generating the response.
        prompt (str): The input prompt for which the response is to be generated.

    Returns:
        str: The generated response text from the model.

    Raises:
        HTTPException: If an error occurs during the response generation process.
    """
    try:
        # Call ollama's chat function and stream the response
        stream = ollama.chat(
            model=model,
            messages=[{'role': 'user', 
                       'content': prompt}],
            stream=True
        )

        response_text = ""
        # Collect the streamed content
        for chunk in stream:
            response_text += chunk['message']['content']

        return response_text
    except Exception as e:
        logger.error(f"Exception occurred: {e}")  # Log the exception
        raise HTTPException(status_code=500, detail=f"Error generating response: {e}")

@app.post("/generate")
async def generate_text(request: PromptRequest) -> dict:
    """
    Generate text based on the provided prompt and model.

    This endpoint receives a prompt request containing the model and prompt text,
    generates a response using the specified model, and logs the process.

    Args:
        request (PromptRequest): The request object containing the model and prompt.

    Returns:
        dict: A dictionary containing the generated text under the key "text".
    """
    model = "deepseek-r1:1.5b"
    prompt = request.prompt

    logger.info(f"Generating Text with Model: {model} and Prompt: {prompt}")

    # Generate the response using the helper function
    response = await generate_response(model, prompt)

    logger.info(f"Received Response: {response}")


    return {"text": response}


