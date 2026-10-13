#!/bin/sh
# Downloads the MediaPipe Tasks frameworks for iOS into ios/Vendor/MediaPipe.
# They come from the same tarballs CocoaPods uses, pinned by version and SHA-256.
# They are too large for Git (about 370 MB), so ios/Vendor is ignored.
set -eu

VERSION=1.0.0
ROOT=$(cd "$(dirname "$0")/.." && pwd)
VENDOR="$ROOT/Vendor/MediaPipe"
CACHE="$ROOT/Vendor/.downloads"

fetch() {
  name=$1 url=$2 sha=$3
  archive="$CACHE/$name-$VERSION.tar.gz"
  if [ ! -f "$archive" ] || ! echo "$sha  $archive" | shasum -a 256 -c - >/dev/null 2>&1; then
    echo "Downloading $name $VERSION…"
    curl -fL --progress-bar -o "$archive.part" "$url"
    mv "$archive.part" "$archive"
  fi
  echo "$sha  $archive" | shasum -a 256 -c -
  rm -rf "$VENDOR/$name"
  mkdir -p "$VENDOR/$name"
  tar -xzf "$archive" -C "$VENDOR/$name"
}

mkdir -p "$CACHE" "$VENDOR"
fetch MediaPipeTasksCommon \
  https://dl.google.com/cpdc/20260727-225047/MediaPipeTasksCommon-1.0.0.tar.gz \
  952403622f5f331ccdc65a1931f5fc6a4c798bd129579fb8accc94c16aed8369
fetch MediaPipeTasksVision \
  https://dl.google.com/cpdc/20260727-225049/MediaPipeTasksVision-1.0.0.tar.gz \
  bd386a43caa40ae957e5f42907076c885992383e642188d64ed96dad5bbdcb76
echo "MediaPipe $VERSION is ready in $VENDOR"
