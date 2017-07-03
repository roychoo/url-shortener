#!/bin/bash

ssh roychoo@ec2-13-228-78-172.ap-southeast-1.compute.amazonaws.com
cd url-shortener
git pull origin master
npm i
