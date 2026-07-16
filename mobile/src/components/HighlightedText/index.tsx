import Text from "components/Text";
import colors from "configs/colors";
import React from "react";

interface HightlightedTextProps {
  text: string;
  searchArray: string[];
  color?: string;
}

const HightlightedText = ({
  text,
  searchArray,
  color = colors.black,
}: HightlightedTextProps) => {
  // Combine search terms into a single regular expression pattern
  const searchPattern = new RegExp(`(${searchArray.join("|")})`, "gi");

  // Split the text using the combined pattern
  const parts = text.split(searchPattern);

  return (
    <Text>
      {parts.map((part, index) => {
        const isHighlighted = searchArray.some(
          (searchTerm: string) =>
            part.toLowerCase() === searchTerm.toLowerCase(),
        );

        return isHighlighted ? (
          <Text
            key={index}
            color={color}
            size={14}
            lineHeight={23}
            type="bold"
            variant="CenturyGothicBold"
          >
            {part}
          </Text>
        ) : (
          <Text key={index} size={14} lineHeight={23}>
            {part}
          </Text>
        );
      })}
    </Text>
  );
};

export default HightlightedText;
