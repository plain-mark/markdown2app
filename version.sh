#!/bin/bash
# Usuń poprzednie pliki

echo "Starting publication process..."
python -m venv venv
source venv/bin/activate
# Upewnij się że mamy najnowsze narzędzia
pip install --upgrade pip build twine

# Sprawdź czy jesteśmy w virtualenv
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Aktywuj najpierw virtualenv!"
    exit 1
fi


pip install -r requirements.txt

pip install -e .
python version/src.py -f src/markdown2app/__init__.py
python version/src.py -f src/markdown2app/_version.py
#python version/setup.py
#python version/src.py

python changelog.py
#python increment.py
bash git.sh
bash publish.sh
