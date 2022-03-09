#!/bin/bash

fail () {
  echo TEST FAILED
  exit 1
}

cmp <(node test.js 2>&1 || echo failed) <(echo caught) || fail
echo TEST PASSED

