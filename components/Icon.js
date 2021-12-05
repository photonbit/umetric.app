import React from 'react'
import {SvgXml} from 'react-native-svg'

import {getIcon} from '../services/UmetricAPI'
import {useQuery} from "react-query";

export default function Icon({icon}) {
    const emptySVG = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
    const {data, isError, isLoading} = useQuery(['icon', icon], getIcon)

    if (isError || isLoading) {
        return (
            <SvgXml xml={emptySVG} width="100%" height="100%"/>
        );
    }


    return (
        <SvgXml xml={data} width="100%" height="100%"/>
    )
}
