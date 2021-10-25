from fastapi import APIRouter, Depends, HTTPException
from loguru import logger
from pydantic import BaseModel
from starlette import status
from elastic.database import search as database_search
from users import fastapi_users

router = APIRouter(prefix="/elastic_search", tags=["Elastic Search"])


class ESRequest(BaseModel):
    text: str
    industry: str


@router.post("/search")
# @cache(expire=API_CONFIG_DEFAULT_CACHING_DURATION_IN_SECONDS)
async def people_search(request: ESRequest,
                        index: str = "analystt.*",
                        limit: int = 10):
    logger.info(f"In elastic Search: ..{request}")
    try:
        # text = decode
        if not request.text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Please enter valid text"
            )
        if not (results := await database_search(index=index, query=request.text, query_industry=request.industry,
                                                 limit=limit)):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No Search Results"
            )

        logger.debug(f"{len(results)=}")
        # logger.debug(results)
        return results
    except Exception as e:
        logger.error(f"Error in elastic search: {e=}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error in elastic search"
        )
