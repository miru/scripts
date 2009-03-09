#!/usr/bin/perl

while(<STDIN>){
  push @lines, $_;
}

while(@lines){
   print pop(@lines);
}
