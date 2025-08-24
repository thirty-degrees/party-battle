#!/usr/bin/env python3
import argparse
import json
import sys


def read_version(manifest_path: str, package_path: str) -> str:
    with open(manifest_path) as manifest_file:
        data = json.load(manifest_file)
    version = str(data.get(package_path, "")).lstrip("v")
    return version


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("package_path")
    parser.add_argument("--manifest", default=".release-please-manifest.json")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    version = read_version(args.manifest, args.package_path)
    if not version:
        sys.exit(1)
    sys.stdout.write(version)


if __name__ == "__main__":
    main()


