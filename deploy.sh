#!/usr/bin/env bash

DATE=`date '+%Y-%m-%d-%H%M%S'`
DEPLOY_DIRECTORY="/home/dashboard/deploy_$DATE/"
CONNECTION_AND_DIRECTORY="dashboard@dashboard.theploughharborne.co.uk:$DEPLOY_DIRECTORY"
PRIVATE_KEY="~/.ssh/id_rsa"

yarn install
if [[ "$?" -ne "0" ]]; then
    echo "Front end deps not installed correctly. Exiting."
    exit 1
else
    echo "Front end deps installed successfully"
fi

yarn prebuildtest
#todo stop on test failure

yarn build

echo "Copying files to remote host..."
ssh dashboard@dashboard.theploughharborne.co.uk "mkdir -p $DEPLOY_DIRECTORY"
rsync -rvz --exclude ".git" --exclude ".idea" --exclude "assets" --exclude "infrastructure" --exclude "node_modules" --exclude "vagrant" --exclude "var" --exclude "vendor" ./ $CONNECTION_AND_DIRECTORY

echo "Running setup on remote host..."
ssh dashboard@dashboard.theploughharborne.co.uk "cd $DEPLOY_DIRECTORY ; ./setup.sh"

echo "Creating symlink to new directory..."
ssh dashboard@dashboard.theploughharborne.co.uk "ln -nfs $DEPLOY_DIRECTORY/public/ /home/dashboard/public_html"