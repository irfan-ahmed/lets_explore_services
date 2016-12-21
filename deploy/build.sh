#!/usr/bin/env bash

main() {
    init
    build_ui
    #build_services
}

init() {
    . env.sh
    DIR=$(dirname $0)
    cd $DIR/..
    ROOT=${PWD}

    if [ -z "$PROJECT_ID" ]; then
        echo "Missing PROJECT_ID environment variable. Set this variable and then re-run the script"
        exit 1
    fi
    echo "Building Services for $PROJECT_ID"
    gcloud config set project $PROJECT_ID

    # set the correct version
    cd $ROOT/deploy
    touch .version
    local version=$(cat .version)
    if [ -z "$version" ]; then
        version=1
    fi
    OLD_TAG="v${version}"
    version=$(($version+1))
    NEW_TAG="v${version}"
    echo "Tags: $OLD_TAG $NEW_TAG"
    echo $version > .version
    sed -e "s/$OLD_TAG/$NEW_TAG/g" explorer-pod.json > $$.json
    cp $$.json explorer-pod.json
    rm -f $$.json
    sed -e "s/$OLD_TAG/$NEW_TAG/g" explorer-ui-pod.json > $$.json
    cp $$.json explorer-ui-pod.json
    rm -f $$.json
    git commit -m "Updated tag from $OLD_TAG to $NEW_TAG" explorer-pod.json explorer-ui-pod.json
    git push
}

build_services() {
    for dir in $(ls $ROOT/services)
    do
        local service_name="${dir}-service"
        local image_name=gcr.io/$PROJECT_ID/${service_name}:${NEW_TAG}
        echo "Building Service : $dir | $service_name | $image_name"
        cd $ROOT/services/$dir
        rm -rvf node_modules/service-utils
        npm install
        cat Dockerfile
        docker build -t $image_name .
        gcloud docker -- push $image_name
        docker rmi $image_name
        echo
        echo
    done
}

build_ui() {
    local dir=ui
    local service_name="${dir}-front-end:${NEW_TAG}"
    local image_name=gcr.io/$PROJECT_ID/${service_name}
    echo "Building Service : $dir | $service_name | $image_name"
    cd $ROOT/$dir
    cat Dockerfile
    docker build -t $image_name .
    gcloud docker -- push $image_name
    docker rmi $image_name
    echo
    echo
}

deploy_pod(){
    # delete and deploy for now
    cd $ROOT/deploy
    echo $PWD
    echo "Deploying Pod"
    # set zone
    gcloud config set compute/zone us-central1-a

    # remove old artefacts
    gcloud container clusters get-credentials $clusterName
    kubectl delete pod,service $podName
    kubectl get pod $podName

    #gcloud container clusters delete $clusterName
    #sleep 10

    # create cluster and get credentials
    #gcloud container clusters create $clusterName
    #gcloud container clusters get-credentials $clusterName
    #sleep 10

    # create services Pod on $clusterName
    kubectl create -f explorer-pod.json
    kubectl get pod $podName
    # wait for pod to be ready
    kubectl expose pod $podName --type="LoadBalancer"
    kubectl get services $podName

    # create the UI pod on $uiClusterName
    gcloud container clusters get-credentials $uiClusterName
    kubectl delete pod,service $uiPodName
    kubectl get pod $uiPodName
    # wait for deletion
    kubectl create -f explorer-ui-pod.json
    kubectl get pod $uiPodName
    # wait for pod to be ready
    kubectl expose pod $uiPodName --type="LoadBalancer"
    kubectl get services
}

main "$*"