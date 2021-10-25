import sys
from typing import Dict
from elasticsearch import AsyncElasticsearch
from fastapi import HTTPException
from loguru import logger
from pydantic import BaseModel, constr
from starlette import status

from config import API_CONFIG_ELASTICSEARCH_URL_WITH_USER_PASS

es = AsyncElasticsearch(
    [API_CONFIG_ELASTICSEARCH_URL_WITH_USER_PASS],
    verify_certs=True,
)


class ElasticsearchQueryRequest(BaseModel):
    index_name: constr(
        to_lower=True, strip_whitespace=True, min_length=3
    ) = "analystt.*"
    query: Dict
    limit: int = 10


async def search(index: str, query: str, query_industry: str, limit: int):
    if not es:
        logger.warning("Elasticsearch not initialized")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Elasticsearch not initialized"
        )

    try:
        if not (
                results := await es.search(
                    index=index,
                    body={"query": {
                        "bool": {
                            "must": [],
                            "filter": [
                                {
                                    "bool": {
                                        "filter": [
                                            {
                                                "multi_match": {
                                                    "type": "phrase",
                                                    "query": query,
                                                    "lenient": True
                                                }
                                            },
                                            {
                                                "multi_match": {
                                                    "type": "phrase",
                                                    "query": query_industry,
                                                    "lenient": True
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "job_company_location_country": "india"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "countries": "india"
                                    }
                                },
                                {
                                    "exists": {
                                        "field": "industry"
                                    }
                                },
                                {
                                    "exists": {
                                        "field": "job_company_industry"
                                    }
                                },
                                {
                                    "exists": {
                                        "field": "job_company_location_locality"
                                    }
                                },
                                {
                                    "exists": {
                                        "field": "job_title_role"
                                    }
                                },
                                {
                                    "exists": {
                                        "field": "work_email"
                                    }
                                }
                            ],
                            "should": [],
                            "must_not": []
                        }
                    }},
                    size=limit,
                    request_timeout=30
                )
        ):
            logger.warning("No Search Results")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Record Not Found"
            )
        logger.debug(f"{type(results)=}, {results}")

        return [
            x.get('_source', {}).get('doc') or x.get('_source', {}) | {"_index": x["_index"], "_id": x["_id"]}
            for x in results["hits"]["hits"]
        ]
        # return None

    except Exception as e:
        logger.critical("Exception Searching Elasticsearch: " + str(e))
        exc_type, exc_obj, exc_tb = sys.exc_info()
        print("line->" + str(exc_tb.tb_lineno))
        print('Exception' + str(e))
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Record Not Found"
        )
