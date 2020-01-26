#!/usr/bin/env bash

# die on error
set -e

# https://gist.github.com/cjus/1047794
echo 'Retrieving latest deploy...'
url=`curl -H "Authorization: Bearer $NETLIFY_ACCESS_TOKEN" https://api.netlify.com/api/v1/sites/use-places-autocomplete.netlify.com/deploys`
temp=`echo $url | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w -m 1 'id'`

# https://www.netlify.com/docs/api/#deploys
echo "Publishing build ${temp##*|}..."
curl -X POST -H "Authorization: Bearer $NETLIFY_ACCESS_TOKEN" -d "{}" "https://api.netlify.com/api/v1/sites/use-places-autocomplete.netlify.com/deploys/${temp##*|}/restore"

# https://open-api.netlify.com/#/default/lockDeploy
echo "Locking deploy to ${temp##*|}..."
curl -X POST -H "Authorization: Bearer $NETLIFY_ACCESS_TOKEN" -d "{}" "https://api.netlify.com/api/v1/deploys/${temp##*|}/lock"
