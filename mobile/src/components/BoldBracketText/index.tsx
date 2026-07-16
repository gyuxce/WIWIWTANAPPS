import Text from "components/Text";
import React from "react";

interface BoldBracketTextProps {
  text: string;
  color?: string;
  size?: number;
}

const BoldBracketText = ({
  text,
  color = "black",
  size = 12,
}: BoldBracketTextProps) => {
  // Regular expression to match text within square brackets
  const bracketPattern = /\[(.*?)\]/g;

  // Split the text using the pattern, while keeping the matched parts
  const parts = text?.split(bracketPattern);

  return (
    <Text>
      {parts?.map((part, index) => {
        // Check if the part was originally within brackets
        const isBracketed = index % 2 !== 0;

        return isBracketed ? (
          <Text
            key={index}
            color={color}
            size={size}
            lineHeight={20}
            type="bold"
            variant="CenturyGothicBold"
          >
            {part}
          </Text>
        ) : (
          <Text key={index} size={size} lineHeight={20}>
            {part}
          </Text>
        );
      })}
    </Text>
  );
};

export default BoldBracketText;
