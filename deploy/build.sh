#!/usr/bin/env bash

main() {
    init
    #build_ui
    build_services
}

init() {
    DIR=$(dirname $0)
    cd $DIR/..
    ROOT=${PWD}

    if [ -z "$PROJECT_ID" ]; then
        echo "Missing PROJECT_ID environment variable. Set this variable and then re-run the script"
        exit 1
    fi
    echo "Building Services for $PROJECT_ID"
    gcloud config set project $PROJECT_ID
}

build_services() {
    for dir in $(ls $ROOT/services)
    do
        local service_name="${dir}-service:v1"
        local image_name=gcr.io/$PROJECT_ID/${service_name}
        local apiKey=${dir}_API_KEY
        eval API_KEY_VALUE=\$$apiKey
        echo "API_Key for $dir ${API_KEY_VALUE}"
        echo "Building Service : $dir | $service_name | $image_name"
        docker rmi $image_name
        cd $ROOT/services/$dir
        cat config.js > orig_config.js
        sed -e "s/API_KEY/${API_KEY_VALUE}/" config.js >> $$config.js
        cp $$config.js config.js
        rm -f $$config.js
        cat config.js
        cat Dockerfile
        docker build -t $image_name .
        mv orig_config.js config.js
        #gcloud docker -- push $image_name
        echo
        echo
    done
}

build_ui() {
    local dir=ui
    local service_name="${dir}-front-end:v1"
    local image_name=gcr.io/$PROJECT_ID/${service_name}
    echo "Building Service : $dir | $service_name | $image_name"
    docker rmi $image_name
    cd $ROOT/$dir
    cat Dockerfile
    docker build -t $image_name .
    gcloud docker -- push $image_name
    echo
    echo
}

main "$*"