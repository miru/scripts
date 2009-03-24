#!/bin/bash

GITDIR=~/src/git
VIMPSVN=~/src/svn/vimp/trunk/xpi
VIMPGIT=~/src/git/dot-files/xpi

pushd $GITDIR

for D in *
do
  cd $D
  git pull

  case $D in
  "liberator")
     make xpi
     cp downloads/vimperator*.xpi $VIMPSVN/
     svn add $VIMPSVN/*
     svn ci $VIMPSVN -m "vimperator.xpi nightly build"
     cp downloads/vimperator*.xpi $VIMPGIT/
     pushd $VIMPGIT
     git add $VIMPGIT/*
     git commit -a -m "vimperator.xpi nightly build"
     popd
  ;;
  "limechat")
  ;;
  "*")
  ;;
  esac

  cd ..
done

popd

