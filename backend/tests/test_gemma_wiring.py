from app.gemma import GemmaLocalAdapter
from app.main import create_app
from fastapi.testclient import TestClient


def test_gemma_adapter_is_lazy():
    adapter = GemmaLocalAdapter("C:/hf/g3")
    assert adapter.loaded is False
    assert adapter._model is None


def test_json_parser_accepts_one_object_without_loading_weights():
    assert GemmaLocalAdapter._json_object('```json\n{"diagnosis":"unknown_or_ambiguous"}\n```') == {
        "diagnosis": "unknown_or_ambiguous"
    }


def test_api_reports_configured_model_without_loading_it(tmp_path):
    adapter = GemmaLocalAdapter("C:/hf/g3")
    api = TestClient(create_app(db_path=str(tmp_path / "db.sqlite3"), model=adapter))
    assert api.get("/api/v1/model/status").json() == {
        "configured": True, "loaded": False, "type": "gemma-3-1b-it", "last_error": None
    }
    response = api.options("/api/v1/questions", headers={
        "Origin": "http://localhost:5173", "Access-Control-Request-Method": "GET"
    })
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
