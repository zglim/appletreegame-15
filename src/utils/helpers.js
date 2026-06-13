export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function xPos(i) {
  const minBasketX = 22;
  const offset = 25;
  if (i < 5) {
    return minBasketX + i * offset;
  }
  if (i < 10) {
    return minBasketX + (i - 5) * offset;
  }
  return minBasketX + (i - 5) * offset;
}

export function yPos(i) {
  const basketFirstLine = 52;
  const basketSecondLine = 30;
  if (i < 5) {
    return basketFirstLine;
  } else if (i < 10) {
    return basketSecondLine;
  }
  return (basketFirstLine + basketSecondLine) / 2;
}

export function treeXPos(yPosValue) {
  if (yPosValue < 40) {
    return randomInt(920, 950);
  }
  if (yPosValue < 90) {
    return randomInt(750, 1050);
  }
  if (yPosValue < 130) {
    return randomInt(690, 1200);
  }
  if (yPosValue < 190) {
    return randomInt(650, 1230);
  }
  if (yPosValue < 285) {
    return randomInt(650, 1250);
  }
  if (yPosValue < 340) {
    return randomInt(750, 1150);
  }
  return randomInt(750, 1150);
}

export function treeYPos(i, yPosValue) {
  const max = 340;
  const min = 30;
  yPosValue.push(randomInt(min, max));
  return [yPosValue, yPosValue[i]];
}

export function calculateScore(startTime, endTime, totalApples, collectedApples) {
  const duration = Math.floor((endTime - startTime) / 1000);
  const completionRate = collectedApples / totalApples;
  const completionBonus = Math.floor(completionRate * 100);
  const timeBonus = Math.max(0, 200 - duration * 2);
  const totalScore = completionBonus + timeBonus;

  let rating = 'F';
  if (totalScore >= 250) rating = 'S';
  else if (totalScore >= 200) rating = 'A';
  else if (totalScore >= 150) rating = 'B';
  else if (totalScore >= 100) rating = 'C';
  else if (totalScore >= 50) rating = 'D';

  return {
    duration,
    totalApples,
    collectedApples,
    completionRate: Math.round(completionRate * 100),
    totalScore,
    rating,
  };
}

export function getHistoryRecords() {
  const records = localStorage.getItem('appleTreeHistory');
  return records ? JSON.parse(records) : [];
}

export function saveHistoryRecord(record) {
  const records = getHistoryRecords();
  records.unshift(record);
  if (records.length > 10) records.pop();
  localStorage.setItem('appleTreeHistory', JSON.stringify(records));
}

export function getBestScore() {
  return localStorage.getItem('appleTreeBestScore') || null;
}

export function saveBestScore(score) {
  localStorage.setItem('appleTreeBestScore', JSON.stringify(score));
}

export function isNewRecord(currentScore, bestScore) {
  if (!bestScore) return true;
  return currentScore.totalScore > bestScore.totalScore;
}
