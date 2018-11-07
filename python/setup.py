#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""The setup script."""

from setuptools import setup, find_packages

with open('README.rst') as readme_file:
    readme = readme_file.read()

with open('HISTORY.rst') as history_file:
    history = history_file.read()

requirements = [
    'Click>=6.0',
    'bagit>1.1.1',
]

setup_requirements = [
    'pytest-runner'
]

test_requirements = [
    'pytest'
]

setup(
    author="kba",
    author_email='unixprog@gmail.com',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Natural Language :: English',
        "Programming Language :: Python :: 2",
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
    ],
    description="Tools for handling line-based ground truth for OCR",
    entry_points={
        'console_scripts': [
            'ocr_linegt=ocr_linegt.cli:main',
        ],
    },
    install_requires=requirements,
    license="MIT license",
    long_description=readme + '\n\n' + history,
    include_package_data=True,
    keywords='ocr_linegt',
    name='ocr_linegt',
    packages=find_packages(include=['ocr_linegt']),
    setup_requires=setup_requirements,
    test_suite='tests',
    tests_require=test_requirements,
    url='https://github.com/kba/ocr_linegt',
    version='0.0.1',
    zip_safe=False,
)
