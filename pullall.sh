#!/bin/bash

GITDIR=~/src/git
SVNDIR=~/src/svn
VIMPSVN=~/src/svn/vimp/trunk/xpi
VIMPGIT=~/src/git/dot-files/xpi

function fSvnUp() {
  pushd $SVNDIR
  svn up *
  popd
}

function fGitPull() {
  pushd $GITDIR

  for D in *
  do
    cd $D

    case $D in
    "liberator")
       git fetch origin
       make xpi
       cp downloads/vimperator*.xpi $VIMPSVN/
       svn add $VIMPSVN/*
       svn ci $VIMPSVN -m "vimperator.xpi nightly build"
       cp downloads/vimperator*.xpi $VIMPGIT/
       pushd $VIMPGIT
       git add $VIMPGIT/*
       git commit -a -m "vimperator.xpi nightly build"
       git push
       popd
    ;;
    "limechat")
      git pull
    ;;
    "*")
      git pull
    ;;
    esac

    cd ..
  done
  popd
}

fSvnUp
fGitPull

