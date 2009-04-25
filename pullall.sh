#!/bin/bash

GITDIR=~/src/git
SVNDIR=~/src/svn
VIMPSVN=~/src/svn/vimp/trunk/xpi
VIMPGIT=~/src/git/dot-files/xpi

function fSvnUp() {
  pushd $SVNDIR

  for D in *
  do
    echo "### svn: $D ###"
    case $D in
    "chronium")
      cd chronium
      #~/src/svn/depot_tools/gclient sync
      #xcodebuild -project src/build/all.xcodeproj
      cd ..
    ;;
    "*")
      cd $D
      svn up .
      cd ..
    ;;
    esac
    done
    popd
}

function fGitPull() {
  pushd $GITDIR

  for D in *
  do
    echo "### git: $D ###"
    cd $D

    case $D in
    "liberator")
       git fetch origin
       git merge origin/master
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
    "scripts")
      git pull
      git commit -a -m "auto commit & push"
      git push
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

