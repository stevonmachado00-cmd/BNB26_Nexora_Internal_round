from app.catalog import BY_CONCEPT_VARIANT
from app.runner import StaticIntake


def test_static_intake_never_executes_code(tmp_path):
    marker = tmp_path / "should-not-exist.txt"
    code = f"open({str(marker)!r}, 'w').write('executed')"
    question = BY_CONCEPT_VARIANT[("print_instead_of_return", 0)]
    result = StaticIntake().run(code, question, "I saw a result")
    assert result == {"status": "not_executed", "passed": None, "cases": [],
                      "reported_result": "I saw a result", "result_verified": False}
    assert not marker.exists()


def test_static_intake_reports_syntax_only():
    question = BY_CONCEPT_VARIANT[("print_instead_of_return", 0)]
    result = StaticIntake().run("def broken(:", question)
    assert result["status"] == "syntax_error"
    assert result["passed"] is None
    assert result["syntax_error"]["line"] == 1
