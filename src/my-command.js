import Sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/

const Document = require('sketch/dom').Document

const capHeightRatio = 0.713984375
const capOffsetRatio = 0.5710278832
const baselineOffsetRatio = 0.4289721168

let lastLayerInGroupIsText = false
let groupOffset = 0

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
  
}

const iterateLayers = (layers) => {

  layers.reverse()

  let i = 0

  while (i < layers.length) {
    
    let layer = layers[i]
    
    if (i == layers.length-1 && checkIfText(layer)) {
      lastLayerInGroupIsText = true
      groupOffset = getBaselineOffset(layer)
    }

    place(layer)

    if (i == layers.length-1 && !checkIfText(layer)) {
      lastLayerInGroupIsText = false
      groupOffset = 0
    }

    let isGroup = checkIfGroup(layer)

    if (isGroup) {
      iterateLayers(layer.layers)
      layer.adjustToFit()
    } else {

    }

    i++

  }

  layers.reverse()

}

const roundToNearest = (value, near) => {
  if (value % near < near / 2) {
    return value + (near - (value % near)) - near
  } else {
    return value + (near - (value % near))
  }
}

const checkIfGroup = (layer) => {
  return layer.type == "Group"
}

const checkIfText = (layer) => {
  return layer.type == "Text"
}

const place = (layer) => {

  let margin = getMargin(layer)
  let bottom = getBottom(layer)

  let position = bottom + margin

  if (checkIfText(layer)) {
    position -= roundToNearest(getCaplineDiff(layer), 1)
    
    let bottomLayer = position + layer.frame.height
    let baselineOffset = getBaselineOffset(layer)
    let baselinePos = bottomLayer - baselineOffset
    let nearestBaseline = roundToNearest(baselinePos, 4)
    let baselineDiff = baselinePos - nearestBaseline

    position -= baselineDiff

  }

  layer.frame.y = position

}

const getMargin = (layer) => {

  let layerName = layer.name
  let marginString = layerName && layerName.split("[margin:") ? layerName.split("[margin:")[1] : undefined
  marginString = marginString && marginString.split("]") ? marginString.split("]")[0] : undefined
  return marginString ? Number(marginString) : 0

}

const getBottom = (layer) => {

  let index = layer.index
  let bottom = 0

  if (index > 0) {
    let prevLayer = layer.parent.layers[index-1]
    bottom = prevLayer.frame.y + prevLayer.frame.height
    bottom -= getBaselineOffset(prevLayer)
    
    if (prevLayer.type == "Group") {
      bottom -= groupOffset
    }

  }


  return checkIfTop(layer) ? 0 : bottom

}

const getBaselineOffset = (layer) => {

  if (checkIfText(layer)) {

    let diff = getCapHeightDiff(layer)
    let baselineOffset = roundToNearest(diff * baselineOffsetRatio, 1)

    // Custom fixes
    if (layer.style.fontSize * 1.5 == layer.style.lineHeight) {
      baselineOffset += 1
    } else if (layer.style.fontSize == 24 && layer.style.lineHeight == 32) {
      baselineOffset += 1
    }

    return baselineOffset

  } else {
    return 0
  }

}

const getCapHeight = (layer) => {

  let fontSize = layer.style.fontSize
  let capHeight = fontSize * capHeightRatio
  return capHeight

}

const getCapHeightDiff = (layer) => {

  let lineHeight = layer.style.lineHeight
  let capHeight = getCapHeight(layer)
  let diff = lineHeight - capHeight

  return diff

}

const getCaplineDiff = (layer) => {
  
  let diff = getCapHeightDiff(layer)
  let caplineDiff = diff * capOffsetRatio
  return caplineDiff

}

const checkIfTop = (layer) => {
  if (layer.name && layer.name.includes("[top]")) {
    return true
  }
}