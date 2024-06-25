import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { addBookmark, getUserBookmarks, removeBookmark } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';
import useAppwrite from '../lib/useAppwrite';

const VideoCard = ({ video }) => {
  const { user } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const { data: bookmarks } = useAppwrite(() => getUserBookmarks(user.$id));
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (bookmarks) {
      setIsBookmarked(bookmarks.map(item => item.$id).includes(video.$id));
    }
  }, [bookmarks, video.$id]);

  const handleBookmark = async () => {
    try {
      setIsBookmarked(!isBookmarked);
      if(isBookmarked){
        await removeBookmark(user.$id, video.$id);
      } else {
        await addBookmark(user.$id, video.$id);
      }
    } catch (error) {
      throw new Error(error);
    } 
  }

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: video?.creator?.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="contain"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
              {video?.title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {video?.creator?.username}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleBookmark} className="pt-2">
          {isBookmarked ? (
            <Ionicons name="bookmark" size={24} color={"rgb(205,205,224)"} />
          ) : (
            <Ionicons name="bookmark-outline" size={24} color={"rgb(205,205,224)"} />
          )}
        </TouchableOpacity>
      </View>

      {play ? (
        <Video
          source={{ uri: video.video }}
          className="w-full h-60 rounded-xl mt-2"
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: video?.thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default VideoCard