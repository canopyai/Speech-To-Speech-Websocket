const emotionProbMap = {
    angry: 0.004192678172460349,
    concern: 0.017087773113071084,
    disgust: 0.09386614892252726,
    excitement: 0.06466385521844237,
    fear: 0.001610240043693076,
    happy: 0.24567481788081924,
    neutral: 0.5395147880667658,
    sad: 0.033389698582220864
  };
  
  // Create an array of values ordered alphabetically by key
  const orderedValues = Object.keys(emotionProbMap)
    .sort() // Sort keys alphabetically
    .map(key => emotionProbMap[key]); // Map sorted keys to their values
  
  console.log(orderedValues);
  