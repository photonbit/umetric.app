import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';

const iconCache = {};

export default function Icon({ icon }) {
  const [loadedIcon, setLoadedIcon] = useState(iconCache[icon] || null);
  const [loading, setLoading] = useState(!iconCache[icon]);

  useEffect(() => {
    if (iconCache[icon]) {
      setLoadedIcon(iconCache[icon]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadIcon() {
      try {
        const module = await import('@hugeicons/core-free-icons');
        const IconComponent = module[`${icon}Icon`];

        if (IconComponent) {
          iconCache[icon] = IconComponent;

          if (isMounted) {
            setLoadedIcon(IconComponent);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error(`Error loading icon: ${icon}`, error);
        if (isMounted) setLoading(false);
      }
    }

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [icon]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!loadedIcon) {
    return <View><ActivityIndicator size="large" /></View>;
  }

  return <HugeiconsIcon icon={loadedIcon} size="100%" />;
}
