import React, { useEffect, useState } from 'react'
import { SvgXml } from 'react-native-svg'

import { getIcon } from '../services/UmetricAPI'

export default function Icon ({ icon }) {
  const emptySVG = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
  const [iconData, setIconData] = useState(emptySVG)

  useEffect(() => {
    const fetchIconData = async () => {
      const iconData = await getIcon(icon)
      setIconData(iconData)
    }

    fetchIconData()
  }, [])

  return (
    <SvgXml xml={iconData} width="100%" height="100%" />
  )
}
