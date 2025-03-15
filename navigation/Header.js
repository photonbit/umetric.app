import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export function Header({ navigation, options }) {
  // This calls the parent drawer navigator
  const openDrawer = () => {
    navigation.getParent()?.openDrawer()
  }

  // The `options.title` is the screen’s title
  const title = options.title

  // If the screen called `navigation.setOptions({ headerRight: () => <SomeButton /> })`,
  // then options.headerRight is a function returning that element
  const renderRight = options.headerRight ? options.headerRight() : null

  return (
    <View style={styles.container}>
      {/* Left side: Title (press to open the Drawer) */}
      <TouchableOpacity onPress={openDrawer}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>

      {/* Right side: If any (headerRight) */}
      <View style={styles.right}>
        {renderRight}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // Make a row with space-between so the right item floats to the right
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  right: {
    // place for your headerRight content
    flexDirection: 'row',
    alignItems: 'center',
  },
})
