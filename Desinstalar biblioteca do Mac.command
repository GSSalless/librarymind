#!/bin/bash
PLIST="$HOME/Library/LaunchAgents/com.biblioteca.kindle.plist"
launchctl bootout gui/$(id -u) "$PLIST" 2>/dev/null; rm -f "$PLIST"
echo "Biblioteca desligada. Ela não inicia mais sozinha."
