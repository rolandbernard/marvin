#!/bin/bash

# This is an install script that can be used to install this application on linux.

URL=https://github.com/rolandbernard/marvin/releases/latest/download
DIR=~/.config/marvin/bin
SCRIPT=${DIR}/marvin
DESKTOP=~/.local/share/applications/marvin.desktop
BIN=/usr/bin/marvin

mkdir -p ${DIR}

VERSION=$(wget -qO- ${URL}/latest-linux.yml | awk '/version/ { print $2 }')

if [ ${DIR}/Marvin-*.AppImage ]
then
    rm -f ${DIR}/Marvin-*.AppImage
fi

wget -P ${DIR} ${URL}/Marvin-${VERSION}.AppImage
chmod uga+x ${DIR}/Marvin-${VERSION}.AppImage

rm -f ${SCRIPT}
echo -e '#!/bin/sh' "\n${DIR}/Marvin-*.AppImage" > ${SCRIPT}
chmod a+x ${SCRIPT}

echo "
[Desktop Entry]
Name=Marvin
Exec=${SCRIPT}
Terminal=false
Type=Application
" > ${DESKTOP}

sudo rm -f ${BIN}
sudo ln -s ${SCRIPT} ${BIN}

