import React from 'react';
import { Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import * as Icons from '../assets/icons';

export default function Icon({icon}) {
	return (
		<SvgXml xml={Icons[icon]} width="100%" height="100%" />	
	);
}

