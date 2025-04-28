#!/bin/bash
# Konfiguracja usługi systemd dla markdown2app

set -e  # Zatrzymanie przy błędzie

echo "===== Konfiguracja usługi systemd dla markdown2app ====="

# Sprawdzenie uprawnień
if [ "$EUID" -ne 0 ]; then
  echo "Proszę uruchomić jako root (sudo)."
  exit 1
fi

# Ścieżka do zainstalowanego pakietu
markdown2app_PATH=$(pip3 show markdown2app | grep "Location" | awk '{print $2}')
if [ -z "$markdown2app_PATH" ]; then
  echo "Błąd: Nie znaleziono pakietu markdown2app. Czy został zainstalowany?"
  exit 1
fi

# Utworzenie usługi systemd
echo "Tworzenie usługi systemd..."
cat > /etc/systemd/system/markdown2app.service << EOF
[Unit]
Description=markdown2app - Bezpieczny interfejs głosowy AI dla dzieci
After=network.target

[Service]
ExecStart=/usr/bin/python3 -m markdown2app
WorkingDirectory=/home/$SUDO_USER
StandardOutput=journal
StandardError=journal
Restart=always
User=$SUDO_USER
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

# Aktywacja usługi
echo "Aktywacja usługi..."
systemctl daemon-reload
systemctl enable markdown2app.service

echo "===== Konfiguracja usługi zakończona! ====="
echo "Aby uruchomić usługę: sudo systemctl start markdown2app"
echo "Aby sprawdzić status: sudo systemctl status markdown2app"
echo "Aby zatrzymać usługę: sudo systemctl stop markdown2app"