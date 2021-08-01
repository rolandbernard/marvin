#!/bin/bash

# This is an install script that can be used to install this application on linux.

URL=https://github.com/rolandbernard/marvin/releases/latest/download
DIR=~/.config/marvin
LINK=/usr/bin/marvin

mkdir -p ${DIR}

VERSION=$(wget -qO- ${URL}/latest-linux.yml | awk '/version/ { print $2 }')

if [ ${DIR}/Marvin-*.AppImage ]
then
    rm -f ${DIR}/Marvin-*.AppImage
fi

wget -P ${DIR} ${URL}/Marvin-${VERSION}.AppImage
chmod uga+x ${DIR}/Marvin-${VERSION}.AppImage

sudo rm -f ${LINK}
sudo ln -s ${DIR}/Marvin-*.AppImage ${LINK}

