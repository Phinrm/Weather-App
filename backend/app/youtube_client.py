from __future__ import annotations

from typing import Any
import requests

from .config import settings


class YouTubeClient:
    SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or settings.youtube_api_key

    def search_location_videos(self, query: str, max_results: int = 3) -> list[dict[str, Any]]:
        if not self.api_key:
            return []
        params = {
            "part": "snippet",
            "q": f"{query} travel weather city",
            "type": "video",
            "maxResults": max_results,
            "key": self.api_key,
            "safeSearch": "moderate",
        }
        resp = requests.get(self.SEARCH_URL, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        items = []
        for item in data.get("items", []):
            vid = item["id"]["videoId"]
            snippet = item["snippet"]
            items.append(
                {
                    "videoId": vid,
                    "title": snippet.get("title"),
                    "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url"),
                    "channelTitle": snippet.get("channelTitle"),
                    "url": f"https://www.youtube.com/watch?v={vid}",
                }
            )
        return items
