#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Installation of the markdown2app package.
"""

import os
from setuptools import setup, find_packages

# Long description from README.md
try:
    with open(os.path.join(os.path.abspath(os.path.dirname(__file__)), "README.md"), encoding="utf-8") as f:
        LONG_DESCRIPTION = '\n' + f.read()
except FileNotFoundError:
    LONG_DESCRIPTION = ''

# Configuration setup
setup(
    name="markdown2app",
    version="0.1.44",
    description="libs to run markdown as an app in a python3 environment",
    long_description=LONG_DESCRIPTION,
    long_description_content_type="text/markdown",
    author="Tom Sapletta",
    author_email="tom@sapletta.com",
    maintainer="markdown2app developers",
    maintainer_email="info@softreck.dev",
    python_requires=">=3.7",
    url="https://markdown2app.plainmark.com",
    project_urls={
        "Repository": "https://github.com/plain-mark/markdown2app",
        "Changelog": "https://github.com/plain-mark/markdown2app/releases",
        "Wiki": "https://github.com/plain-mark/markdown2app/wiki",
        "Issue Tracker": "https://github.com/plain-mark/markdown2app/issues/new",
    },
    packages=["markdown2app", "markdown2app.config"],
    package_dir={"": "src"},
    license="Apache-2.0",  # Use simple string format
    license_files=("LICENSE"),  # Empty tuple to explicitly prevent license files
    keywords=["python", "markdown2app", "markdown2app", "markdown2app3", "markdown2app"],
    classifiers=[
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
    ],
    # Critical fix for the license-file issue:
    # This prevents setuptools from automatically adding a license-file entry
)