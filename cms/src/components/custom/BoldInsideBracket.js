import React from 'react';

function BoldInsideBracket({ text }) {
  const boldTextInsideBrackets = text.replace(/\[([^[\]]*)\]/g, (_, match) => `[<strong>${match}</strong>]`);

  return <div dangerouslySetInnerHTML={{ __html: boldTextInsideBrackets }} />;
}

export default BoldInsideBracket;
