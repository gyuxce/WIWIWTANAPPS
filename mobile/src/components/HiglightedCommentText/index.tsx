import Text from "components/Text";
import colors from "configs/colors";
import React from "react";

interface HighlightedCommentTextProps {
  text: string;
  color?: string;
}

const HighlightedCommentText = ({
  text,
  color = colors.black,
}: HighlightedCommentTextProps) => {
  // Define a regular expression to match text inside square brackets
  const regex = new RegExp(/\[([^\]]+)\]/g, "gi");

  // Use match to find all matches of text inside square brackets
  const matches = text.match(regex);

  if (!matches) {
    // If no matches found, render the entire text as is
    return (
      <Text size={13} lineHeight={23}>
        {text}
      </Text>
    );
  }

  // Initialize the position to keep track of the current position in the text
  let currentPosition = 0;

  return (
    <Text>
      {matches.map((match, index) => {
        // Find the position of the current match in the text
        const position = text.indexOf(match, currentPosition);

        // Extract the text before the match
        const beforeText = text.substring(currentPosition, position);

        // Update the current position
        currentPosition = position + match.length;

        //const cleanedText = extractedText.map(match => match.slice(1, -1));

        return (
          <Text key={index}>
            <Text size={13} lineHeight={23}>
              {beforeText}
            </Text>
            <Text
              key={index}
              color={color}
              size={13}
              lineHeight={23}
              type="bold"
              variant="CenturyGothicBold"
            >
              {match.replace("[", "").replace("]", "")}
              {/* {extractedText[0]} */}
            </Text>
          </Text>
        );
      })}
      <Text size={13} lineHeight={23}>
        {text.substring(currentPosition)}
      </Text>
    </Text>
  );
};

export default HighlightedCommentText;
