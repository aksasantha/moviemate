from fastapi import APIRouter

from pydantic import BaseModel

from app.services.ai import generate_review

router = APIRouter()


class ReviewRequest(BaseModel):
    notes: str


@router.post("/generate-review")
def generate_ai_review(data: ReviewRequest):

    review = generate_review(data.notes)

    return {
        "review": review
    }