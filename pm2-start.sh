#!/bin/bash
npm i
sleep 2
cd /opt/node_agent; pm2 start ecosystem.config.js