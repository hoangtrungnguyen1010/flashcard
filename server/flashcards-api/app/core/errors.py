from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from typing import Union
from pydantic import ValidationError

class AppException(Exception):
    def __init__(
        self, 
        status_code: int, 
        detail: Union[str, dict, list], 
        headers: dict = None
    ):
        self.status_code = status_code
        self.detail = detail
        self.headers = headers

def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers=exc.headers,
        )
    
    @app.exception_handler(ValidationError)
    async def validation_exception_handler(request: Request, exc: ValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": exc.errors()},
        )
