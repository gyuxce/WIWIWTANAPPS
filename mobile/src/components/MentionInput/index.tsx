import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const MentionInput = () => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const formatText = (text: string) => {
    const boldRegex = /\[([^\]]+)\]/g;
    let currentIndex = 0;
    const formattedText = [];

    let match;
    while ((match = boldRegex.exec(text))) {
      const mentionStart = match.index;
      const mentionEnd = boldRegex.lastIndex;
      const plainText = text.substring(currentIndex, mentionStart);

      formattedText.push(
        <Text key={currentIndex}>{plainText}</Text>, // Add plain text before the mention
        <Text key={mentionStart} style={styles.bold}>
          {match[1]} {/* Extract and format the mention */}
        </Text>,
      );

      currentIndex = mentionEnd;
    }

    // Add any remaining plain text after the last mention
    if (currentIndex < text.length) {
      formattedText.push(
        <Text key={currentIndex}>{text.substring(currentIndex)}</Text>,
      );
    }

    return <Text style={styles.mentions}>{formattedText}</Text>;
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Type a message..."
        onChangeText={handleInputChange}
        value={inputText}
        style={styles.input}
      >
        {formatText(inputText)}
      </TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
    marginBottom: 10,
  },
  mentions: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default MentionInput;
