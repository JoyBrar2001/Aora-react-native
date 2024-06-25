import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const Create = () => {
  return (
    <SafeAreaProvider className="bg-primary h-full">
      <Text>Create</Text>
    </SafeAreaProvider>
  )
}

export default Create