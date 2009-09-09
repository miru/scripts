#!/bin/zsh

pushd ~/app/TwitterIrcGateway
nohup mono TwitterIrcGatewayCLI.exe -encoding=utf-8 2>/dev/null 1>/dev/null &
popd

