import React, {useEffect, useState} from 'react'
import { SvgXml } from 'react-native-svg'

import { get_icon } from '../services/UmetricAPI'

export default function Icon ({ icon }) {
  const emptySVG = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
  const [ iconData, setIconData ] = useState(emptySVG)

  function download_icon(response) {
    setIconData(response.data)
  }

  useEffect(() => {
    get_icon(icon, download_icon, console.error)
  })

  return (
    <SvgXml xml={iconData} width="100%" height="100%" />
  )
}
