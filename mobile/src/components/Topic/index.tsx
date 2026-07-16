import Text from "components/Text";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface TopicProps {
  id: string;
  image: any;
  imageSelected: any;
  title: string;
  form: {
    title: string;
    topic: { id?: string; title?: string; image?: any; imageSelected?: any };
  };
  selectedTopic: {
    id?: string;
    title?: string;
    image?: any;
    imageSelected?: any;
  };
  setForm: any;
}

const Topic = ({
  image,
  imageSelected,
  title,
  selectedTopic,
  setForm,
  form,
  id,
}: TopicProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (selectedTopic.id !== id) {
          setForm({ ...form, topic: { id, image, title, imageSelected } });
        } else {
          setForm({ ...form, topic: { title: "" } });
        }
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
        marginHorizontal: scaledHorizontal(25),
        paddingHorizontal: scaledHorizontal(10),
        marginBottom: scaledVertical(20),
        paddingVertical: 5,
        borderWidth: selectedTopic.id === id ? 1 : 0,
        borderRadius: 10,
      }}
    >
      <Image
        source={selectedTopic.id === id ? imageSelected : image}
        style={{ height: 38, width: 38, resizeMode: "contain" }}
      />
      <Text lineHeight={24}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Topic;
