#!/bin/bash
# Generate gallery manifest from optimized folders

RUNWAY_IMAGES=$(ls -1 "assets/images/collections/aw25/runway_shots/optimized/" 2>/dev/null | grep -iE '\.(jpg|jpeg|png|webp)$' | sort | sed 's/.*/"&"/' | tr '\n' ',' | sed 's/,$//')
EDITORIAL_IMAGES=$(ls -1 "assets/images/collections/editorial/optimized/" 2>/dev/null | grep -iE '\.(jpg|jpeg|png|webp)$' | sort | sed 's/.*/"&"/' | tr '\n' ',' | sed 's/,$//')

cat > assets/images/gallery-manifest.json << MANIFEST
{
  "galleries": {
    "aw25-runway": {
      "path": "assets/images/collections/aw25/runway_shots/optimized",
      "images": [$RUNWAY_IMAGES]
    },
    "editorial": {
      "path": "assets/images/collections/editorial/optimized",
      "images": [$EDITORIAL_IMAGES]
    }
  }
}
MANIFEST

echo "Gallery manifest generated!"
