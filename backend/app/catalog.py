"""Hand-authored Python exercises. Never load training/evaluation rows here."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Question:
    id: str
    concept: str
    variant: int
    prompt: str
    function: str
    cases: tuple[dict, ...]


# Each concept has an initial task and two distinct transfer tasks.
# Expected values are trusted author input and are not sent to the model.
SPECS = {
    "range_starts_at_one": (
        "Use the inclusive range of integers in the requested calculation.",
        [("sum_through", "Return the sum of integers from 1 through n.", [(1, 1), (5, 15)]),
         ("product_through", "Return the product of integers from 1 through n.", [(1, 1), (4, 24)]),
         ("count_evens_through", "Count even integers from 1 through n.", [(2, 1), (7, 3)])]),
    "print_instead_of_return": (
        "A caller needs the value returned by the function.",
        [("add", "Return the sum of a and b as an integer; the caller uses the returned value.", [((3, 5), 8), ((0, 0), 0)]),
         ("square_value", "Return x squared as an integer.", [(4, 16), (-2, 4)]),
         ("add_one", "Return x plus one as an integer.", [(7, 8), (0, 1)])]),
    "function_local_scope": (
        "Data computed inside a function must be returned to its caller.",
        [("make_total", "Return the total of the given integer list.", [([2, 3], 5), ([], 0)]),
         ("make_average", "Return the average of a nonempty integer list.", [([2, 4], 3.0), ([5], 5.0)]),
         ("make_count", "Return how many values are in the list.", [([1, 2, 3], 3), ([], 0)])]),
    "list_assignment_copies": (
        "A modified copy must leave the original list unchanged.",
        [("append_copy", "Return a new list with x appended, leaving values unchanged.", [(([1, 2], 3), [1, 2, 3]), (([], 5), [5])]),
         ("replace_copy", "Return a new list with its first item replaced by x; leave values unchanged.", [(([1, 2], 9), [9, 2]), (([4], 8), [8])]),
         ("remove_copy", "Return a new list without its last item; leave values unchanged.", [([1, 2, 3], [1, 2]), ([4], [])])]),
    "list_index_starts_at_one": (
        "Python indexes the first list element at zero.",
        [("first_item", "Return the first item in a nonempty list.", [([3, 8], 3), ([5], 5)]),
         ("second_item", "Return the second item in a list with at least two items.", [([3, 8], 8), ([1, 9, 2], 9)]),
         ("swap_first_two", "Return a new list with the first two items swapped.", [([1, 2, 3], [2, 1, 3]), ([4, 5], [5, 4])])]),
    "assignment_used_for_comparison": (
        "Conditions compare values rather than assign them.",
        [("is_five", "Return whether x equals 5.", [(5, True), (4, False)]),
         ("is_zero", "Return whether x equals 0.", [(0, True), (2, False)]),
         ("same_value", "Return whether a and b have equal values.", [((2, 2), True), ((2, 3), False)])]),
    "return_does_not_stop_execution": (
        "A return ends the current function call immediately.",
        [("classify_sign", "Return 'negative', 'zero', or 'positive' for x.", [(-1, "negative"), (0, "zero"), (2, "positive")]),
         ("grade_pass", "Return 'pass' when score is at least 50, otherwise 'retry'.", [(50, "pass"), (20, "retry")]),
         ("is_small", "Return True when x is less than 10, otherwise False.", [(3, True), (12, False)])]),
    "changing_loop_variable_changes_iteration": (
        "A for-loop gets its next value from the iterator.",
        [("odd_up_to", "Return odd integers from 1 through n.", [(5, [1, 3, 5]), (4, [1, 3])]),
         ("every_second", "Return every second item from values, starting at index zero.", [([1, 2, 3, 4], [1, 3]), ([7], [7])]),
         ("multiples_of_three", "Return multiples of three from 0 through n.", [(7, [0, 3, 6]), (3, [0, 3])])]),
    "sorted_modifies_list_in_place": (
        "sorted(values) returns a new list.",
        [("sort_copy", "Return a sorted copy of values, leaving values unchanged.", [([3, 1], [1, 3]), ([2], [2])]),
         ("smallest_after_sort", "Return the smallest item in a nonempty list without changing it.", [([3, 1], 1), ([5], 5)]),
         ("sort_descending_copy", "Return a descending sorted copy without changing values.", [([1, 3, 2], [3, 2, 1]), ([4], [4])])]),
    "list_reverse_returns_list": (
        "list.reverse() mutates the list and returns None.",
        [("reversed_copy", "Return a reversed copy of values, leaving values unchanged.", [([1, 2], [2, 1]), ([], [])]),
         ("last_first", "Return the last item of a nonempty list without changing it.", [([1, 3], 3), ([4], 4)]),
         ("reverse_words", "Return the words in reverse order without changing the original list.", [(["a", "b"], ["b", "a"]), (["x"], ["x"])])]),
}


def _build() -> dict[str, Question]:
    questions = {}
    for number, (concept, (_, variants)) in enumerate(SPECS.items(), start=1):
        for variant, (function, prompt, examples) in enumerate(variants):
            cases = []
            for args, expected in examples:
                arguments = args if isinstance(args, tuple) else (args,)
                cases.append({"args": list(arguments), "expected": expected})
            qid = f"py{number:02d}-{variant}"
            count = len(cases[0]["args"])
            questions[qid] = Question(qid, concept, variant,
                                     f"Implement {function} with {count} positional argument(s). {prompt}",
                                     function, tuple(cases))
    return questions


QUESTIONS = _build()
BY_CONCEPT_VARIANT = {(q.concept, q.variant): q for q in QUESTIONS.values()}
LABELS = frozenset(SPECS) | {"correct_understanding", "unknown_or_ambiguous"}

# Introductory curriculum questions do not carry misconception labels until
# enough learner evidence exists to diagnose them. Keep them out of SPECS so
# the model's label contract stays aligned with the training manifest.
MODULE_QUESTIONS = {
    "var01-0": Question("var01-0", "variables", 0,
        "Implement increase_score with 2 positional argument(s). Given score and bonus, return their numeric sum.",
        "increase_score", ({"args": [7, 3], "expected": 10}, {"args": [0, 5], "expected": 5})),
    "var01-1": Question("var01-1", "variables", 0,
        "Implement double_number with 1 positional argument. Store the doubled value and return it.",
        "double_number", ({"args": [4], "expected": 8}, {"args": [-3], "expected": -6})),
    "var01-2": Question("var01-2", "variables", 0,
        "Implement total_price with 2 positional arguments. Return price multiplied by quantity.",
        "total_price", ({"args": [2.5, 4], "expected": 10.0}, {"args": [3, 0], "expected": 0})),
}


def intervention_for(label: str) -> dict:
    correction = SPECS[label][0]
    return {"title": label.replace("_", " ").capitalize(), "explanation": correction,
            "hint": "Trace the relevant expression with a small input, then explain what value the caller sees."}
