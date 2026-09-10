#!/bin/bash
find src -type f -name "*.tsx" -exec sed -i \
  -e 's/bg-\[#000000\]/bg-\[#F8F9FA\]/g' \
  -e 's/bg-\[#111111\]/bg-white/g' \
  -e 's/bg-\[#0A0A0A\]/bg-\[#F8F9FA\]/g' \
  -e 's/bg-\[#1A1A1A\]/bg-white/g' \
  -e 's/bg-\[#0D0D0D\]/bg-\[#F8F9FA\]/g' \
  -e 's/bg-\[#0E0E0E\]/bg-white/g' \
  -e 's/bg-\[#161616\]/bg-neutral-50/g' \
  -e 's/bg-\[#120205\]/bg-\[#800020\]/g' \
  -e 's/text-white/text-\[#111111\]/g' \
  -e 's/text-neutral-300/text-neutral-600/g' \
  -e 's/text-neutral-400/text-neutral-500/g' \
  -e 's/border-white\/10/border-neutral-200/g' \
  -e 's/border-white\/20/border-neutral-300/g' \
  -e 's/border-\[#262626\]/border-neutral-200/g' \
  -e 's/border-\[#2B2B2B\]/border-neutral-200/g' \
  -e 's/border-\[#222222\]/border-neutral-200/g' \
  -e 's/bg-black\/80/bg-black\/50/g' \
  {} +
