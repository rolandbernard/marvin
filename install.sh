#!/bin/bash

# This is an install script that can be used to install this application on linux.

URL=https://github.com/rolandbernard/marvin/releases/latest/download
ICONURL=https://raw.githubusercontent.com/rolandbernard/marvin/master/static/logo.svg

DESKDIR=~/.local/share/applications
CONFDIR=~/.config/marvin/bin
LOCALDIR=~/.local/bin
BINDIR=/usr/bin

DESKTOP=${DESKDIR}/marvin.desktop
ICON=${CONFDIR}/logo.svg
SCRIPT=${CONFDIR}/marvin
MSGSCRIPT=${CONFDIR}/marvin-msg
LOCALBIN=${LOCALDIR}/marvin
MSGLOCALBIN=${LOCALDIR}/marvin-msg
BIN=${BINDIR}/marvin
MSGBIN=${BINDIR}/marvin-msg

mkdir -p ${DESKDIR}
mkdir -p ${CONFDIR}
mkdir -p ${LOCALDIR}

VERSION=$(wget -qO- ${URL}/latest-linux.yml | awk '/version/ { print $2 }')

if [ ${CONFDIR}/Marvin-*.AppImage ]
then
    rm -f ${CONFDIR}/Marvin-*.AppImage
fi

wget -P ${CONFDIR} ${ICONURL}
wget -P ${CONFDIR} ${URL}/Marvin-${VERSION}.AppImage
chmod uga+x ${CONFDIR}/Marvin-${VERSION}.AppImage

rm -f ${SCRIPT}
echo -e '#!/bin/sh' "\n${CONFDIR}/Marvin-*.AppImage \$@" > ${SCRIPT}
chmod a+x ${SCRIPT}

rm -f ${MSGSCRIPT}
echo -e '#!/bin/sh' "\necho {\\\"kind\\\":\\\"\$1\\\"} | nc -U /tmp/marvin.sock" \
    > ${MSGSCRIPT}
chmod a+x ${MSGSCRIPT}

echo "
[Desktop Entry]
Name=Marvin
Exec=${SCRIPT}
Terminal=false
Type=Application
Icon=${ICON}
" > ${DESKTOP}

rm -f ${LOCALBIN}
ln -s ${SCRIPT} ${LOCALBIN}
rm -f ${MSGLOCALBIN}
ln -s ${MSGSCRIPT} ${MSGLOCALBIN}

sudo /bin/sh -c "
    rm -f ${BIN} ;
    ln -s ${SCRIPT} ${BIN} ;
    rm -f ${MSGBIN} ;
    ln -s ${MSGSCRIPT} ${MSGBIN}
"

