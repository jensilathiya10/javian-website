from pydantic import BaseModel, ConfigDict


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str
    kind: str
    summary: str
    problem: str
    approach: str
    tags: list[str]
