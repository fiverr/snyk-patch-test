mkdir -p fixtures
echo "Download index.js from https-proxy-agent tag 2.2.1"
curl https://raw.githubusercontent.com/TooTallNate/node-https-proxy-agent/8c3a75baddecae7e2fe2921d1adde7edd0203156/index.js > fixtures/https-proxy-agent.js
echo "Download patch file"
curl https://snyk-rules-pre-repository.s3.amazonaws.com/snapshots/master/patches/npm/https-proxy-agent/20190929/https-proxy-agent_0_0_20190929.patch > fixtures/https-proxy-agent.patch
