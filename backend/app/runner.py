"""Docker-free intake. This module never executes learner code."""

import ast
import json


class RunnerUnavailable(Exception):
    """Reserved for a future trusted code evaluator."""


class StaticIntake:
    def run(self, code: str, question, reported_result: str | None = None) -> dict:
        result = {"status": "not_executed", "passed": None, "cases": [],
                  "reported_result": reported_result, "result_verified": False}
        try:
            ast.parse(code)
        except SyntaxError as exc:
            result["status"] = "syntax_error"
            result["syntax_error"] = {"line": exc.lineno, "message": exc.msg}
            return result

        # The browser runs Python through Pyodide. Its report gives the learner
        # immediate, real test feedback, but remains untrusted HTTP input until
        # a server-side sandbox is added.
        if reported_result:
            try:
                report = json.loads(reported_result)
            except (TypeError, ValueError):
                report = None
            if isinstance(report, dict) and report.get("executor") == "pyodide":
                cases = report.get("cases")
                passed = report.get("passed")
                if isinstance(cases, list) and isinstance(passed, bool):
                    result.update({
                        "status": "browser_executed",
                        "passed": passed,
                        "cases": cases[:20],
                        "reported_result": None,
                        "executor": "pyodide",
                    })
        return result
