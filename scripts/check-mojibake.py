#!/usr/bin/env python3
"""Scan project text and local SQLite data for common mojibake patterns."""

from __future__ import annotations

import argparse
import sqlite3
import sys
from pathlib import Path


TEXT_EXTENSIONS = {
    ".dart",
    ".js",
    ".jsx",
    ".json",
    ".md",
    ".php",
    ".sql",
    ".ts",
    ".tsx",
}

SKIP_PARTS = {
    ".git",
    ".gradle",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "vendor",
}

MOJIBAKE_PATTERNS = [
    "\u00e3\u201a",  # Japanese UTF-8 bytes decoded as Windows-1252
    "\u00e3\u0192",
    "\u00e3\u0081",
    "\u00ef\u00bc",
    "\u00e8\u2021",
    "\u00e6\u203a",
    "\u00e9\u20ac",
    "\u00e6\u20ac",
    "\u00e6\u2014",
    "\u00e6\u0153",
    "\u00e7\u00a7",
    "\u00e7\u00ae",
    "\u00e8\u00a8",
    "\u00e8\u00a9",
    "\u00e5\u00ad",
    "\u00e5\u02c6",
    "\u00c3\u0083",
    "\u00c2\u00a0",
    "\u00c2\u00ae",
    "\u00c2\u00a9",
]


def safe_preview(value: str, limit: int = 220) -> str:
    return value.encode("unicode_escape").decode("ascii")[:limit]


def has_mojibake(value: str) -> bool:
    return any(pattern in value for pattern in MOJIBAKE_PATTERNS)


def iter_text_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_PARTS for part in path.parts):
            continue
        if path.suffix.lower() in TEXT_EXTENSIONS:
            files.append(path)
    return files


def scan_files(repo_root: Path, roots: list[Path]) -> list[str]:
    findings: list[str] = []
    for root in roots:
        if not root.exists():
            continue
        for path in iter_text_files(root):
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            for line_number, line in enumerate(text.splitlines(), 1):
                if has_mojibake(line):
                    rel = path.relative_to(repo_root)
                    findings.append(f"{rel}:{line_number}: {safe_preview(line)}")
    return findings


def is_textish_column(name: str, column_type: str) -> bool:
    column_type = column_type.upper()
    if any(marker in column_type for marker in ("TEXT", "VARCHAR", "CHAR", "CLOB")):
        return True
    return any(
        marker in name.lower()
        for marker in (
            "answer",
            "content",
            "description",
            "japan",
            "label",
            "name",
            "question",
            "title",
        )
    )


def scan_sqlite(repo_root: Path, db_path: Path) -> list[str]:
    if not db_path.exists():
        return []

    findings: list[str] = []
    conn = sqlite3.connect(str(db_path))
    try:
        cursor = conn.cursor()
        table_names = [
            row[0]
            for row in cursor.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
            ).fetchall()
        ]
        for table in table_names:
            columns = cursor.execute(f'PRAGMA table_info("{table}")').fetchall()
            text_columns = [
                column[1]
                for column in columns
                if is_textish_column(column[1], column[2] or "")
            ]
            if not text_columns:
                continue

            id_column = "id" if any(column[1] == "id" for column in columns) else None
            selected_columns = ([id_column] if id_column else []) + text_columns
            quoted_columns = ",".join(f'"{column}"' for column in selected_columns)
            try:
                rows = cursor.execute(f'SELECT {quoted_columns} FROM "{table}"').fetchall()
            except sqlite3.DatabaseError:
                continue

            for row in rows:
                row_id = row[0] if id_column else ""
                for column, value in zip(selected_columns, row):
                    if isinstance(value, str) and has_mojibake(value):
                        rel = db_path.relative_to(repo_root)
                        findings.append(
                            f"{rel}:{table}.{column}:{row_id}: {safe_preview(value)}"
                        )
    finally:
        conn.close()
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Scan Wiwitan source and local SQLite data for mojibake."
    )
    parser.add_argument(
        "--repo-root",
        default=Path(__file__).resolve().parents[1],
        type=Path,
        help="Repository root. Defaults to this script's parent repository.",
    )
    parser.add_argument(
        "--sqlite",
        default=None,
        type=Path,
        help="Optional SQLite database path. Defaults to backend/database/database.sqlite.",
    )
    args = parser.parse_args()

    repo_root = args.repo_root.resolve()
    sqlite_path = (
        args.sqlite.resolve()
        if args.sqlite
        else repo_root / "backend" / "database" / "database.sqlite"
    )
    scan_roots = [
        repo_root / "mobile" / "src",
        repo_root / "cms" / "src",
        repo_root / "backend" / "app",
        repo_root / "backend" / "database",
        repo_root / "docs",
    ]

    findings = scan_files(repo_root, scan_roots)
    findings.extend(scan_sqlite(repo_root, sqlite_path))

    if findings:
        print("Mojibake candidates found:")
        for finding in findings:
            print(f"- {finding}")
        return 1

    print("No mojibake candidates found.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
