import Sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/

const Document = require('sketch/dom').Document

let bottom = 0, margin = 0, offset = 0;

let layerIsText = false;

const capHeightRatio = 0.7140625
const capOffsetRatio = 0.5686113394
const baselineOffsetRatio = 0.4315529992

// Run the plugin
export default (context) => {
  let doc = Sketch.fromNative(context.document)
  let layers = doc ? doc.selectedLayers : null
  layers = layers ? layers.layers : null

  // is the seletion an artboard?
  const isArtboard = layers && layers[0] && layers[0].type && layers[0].type == "Artboard" ? true : false

  if (!isArtboard) {
    Sketch.UI.message("Please select an artboard")
    return
  }

  // get the artboards layers
  const artboard = layers[0]
  layers = artboard.layers

  iterateLayers(layers)

  artboard.adjustToFit()
  
}


// iterate over given array of layers
const iterateLayers = (layers) => {

  layers.reverse()

  let i = 0

  while (i < layers.length) {

    let layer = layers[i]

    setMargin(layer)
    checkIfAbsolute(layer)
    place(layer)
    
    let isGroup = checkIfGroup(layer)
    
    if (isGroup) {
      setDefaults()
      let groupLayers = layer.layers
      iterateLayers(groupLayers)
      layer.adjustToFit()
    }

    if (checkIfText(layer)) {
      layerIsText = true
    } else if (checkIfGroup(layer)) {
      layerIsText = layerIsText
    } else {
      layerIsText = false
    }

    setBottom(layer, layerIsText)
    
    i++

  }

  layers.reverse()

}

const roundToNearest = (value, near) => {
  return value + (near - (value % near))
}

// setting the margin value
const setMargin = (layer) => {
  margin = getMargin(layer.name)
}

const getMargin = (name) => {
  let marginString = name.split("[margin:")[1]
  marginString = marginString ? marginString.split("]")[0] : null
  return Number(marginString) ? Number(marginString) : 0
}

// setting the bottom value
const setBottom = (layer, isText) => {
  bottom = layer.frame.y + layer.frame.height

  if (checkIfText(layer)) {
    let {baselineOffset, diff} = getBaselineOffset(layer)
    offset = baselineOffset
  }

  if (isText) {
    bottom -= offset
  } else {
    offset = 0
  }
}

const getBaselineOffset = (layer) => {
  let fontSize = layer.style.fontSize
  let capHeight = fontSize * capHeightRatio
  let lineHeight = layer.style.lineHeight
  let diff = lineHeight - capHeight
  let baselineOffset = baselineOffsetRatio * diff
  baselineOffset = Math.ceil(baselineOffset)

  return {baselineOffset: baselineOffset, diff: diff}
}

// place the layer based on current position and margin
const place = (layer) => {
  let position = bottom + margin

  if (layer.type == "Text") {
    let {baselineOffset, diff} = getBaselineOffset(layer)
    position += baselineOffset
    diff = roundToNearest(diff, 4) - 4
    position -= diff
  }

  layer.frame.y = position
}

// check if the layer is a group
const checkIfGroup = (layer) => {
  return layer.type == "Group"
}

const checkIfText = (layer) => {
  return layer.type == "Text"
}

// reset the position and margin to default (0)
const setDefaults = () => {
  bottom = 0;
  margin = 0;
}

// checks to see if the layer has is stuck to the top of its group
const checkIfAbsolute = (layer) => {
  if (layer.name && layer.name.includes("[absolute]")) {
    bottom = 0;
  }
}