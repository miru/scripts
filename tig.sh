#!/bin/sh

pushd ~/app/tig
nohup mono TwitterIrcGatewayCLI.exe -encoding=utf-8 2>/dev/null 1>/dev/null &

