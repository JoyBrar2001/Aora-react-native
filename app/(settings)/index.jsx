import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router';

import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

import { updateUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const Settings = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const [form, setForm] = useState({
    imageUrl: user?.avatar,
    newImage: null,
    email: user?.email,
    username: user?.username,
  });

  const submit = async () => {
    try {
      const result = await updateUser(user.$id, form);
      
      Alert.alert('Success', 'Profile uploaded successfully');
      
      setUser(result);
      router.replace('/profile');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/png', 'image/jpg', 'image/jpeg']
    });

    if (!result.canceled) {
      setForm({ ...form, imageUrl: result.assets[0].uri, newImage: result.assets[0] });
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full h-full justify-start px-4 my-6">

        <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
          Edit Your Profile
        </Text>

        <TouchableOpacity onPress={openPicker} className="mt-10">
          <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center mx-auto">
            <Image
              source={{ uri: form.imageUrl }}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode='cover'
            />
          </View>
          <Text className="font-pmedium text-sm text-gray-100 text-center mt-2">
            Tap to update your profile picture
          </Text>
        </TouchableOpacity>

        <FormField
          title="Username"
          value={form.username}
          handleChangeText={(e) => setForm({ ...form, username: e })}
          otherStyles="mt-10"
        />

        <FormField
          title="Email"
          otherStyles="mt-10"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          keyboardType="email-address"
        />

        <CustomButton
          title="Update"
          handlePress={submit}
          containerStyles="mt-7"
        />
      </View>
    </SafeAreaView>
  );
}

export default Settings