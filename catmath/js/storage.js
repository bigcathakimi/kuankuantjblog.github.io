(function () {
  var S = {};
  var STORAGE_KEY = "catmath_data";

  function loadData() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) { }
    return { wrong: [], progress: {}, settings: {} };
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { }
  }

  S.addWrong = function (question, userAnswer, correctAnswer, topicId) {
    var data = loadData();
    data.wrong.push({
      question: question,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      topicId: topicId,
      time: Date.now(),
      retried: false
    });
    saveData(data);
  };

  S.getWrongList = function (topicId) {
    var data = loadData();
    if (topicId) {
      return data.wrong.filter(function (w) { return w.topicId === topicId; });
    }
    return data.wrong;
  };

  S.clearWrong = function () {
    var data = loadData();
    data.wrong = [];
    saveData(data);
  };

  S.markWrongRetried = function (index) {
    var data = loadData();
    if (data.wrong[index]) {
      data.wrong[index].retried = true;
      saveData(data);
    }
  };

  S.removeWrong = function (index) {
    var data = loadData();
    data.wrong.splice(index, 1);
    saveData(data);
  };

  S.updateProgress = function (topicId, correct, total) {
    var data = loadData();
    if (!data.progress[topicId]) {
      data.progress[topicId] = { correct: 0, total: 0, lastTime: 0 };
    }
    data.progress[topicId].correct += correct;
    data.progress[topicId].total += total;
    data.progress[topicId].lastTime = Date.now();
    saveData(data);
  };

  S.getProgress = function (topicId) {
    var data = loadData();
    return data.progress[topicId] || { correct: 0, total: 0, lastTime: 0 };
  };

  S.getAllProgress = function () {
    var data = loadData();
    return data.progress;
  };

  S.getStats = function () {
    var data = loadData();
    var totalCorrect = 0, totalQuestions = 0;
    var keys = Object.keys(data.progress);
    for (var i = 0; i < keys.length; i++) {
      totalCorrect += data.progress[keys[i]].correct;
      totalQuestions += data.progress[keys[i]].total;
    }
    return {
      totalCorrect: totalCorrect,
      totalQuestions: totalQuestions,
      totalTopics: keys.length,
      wrongCount: data.wrong.length,
      accuracy: totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0
    };
  };

  window.MathApp = window.MathApp || {};
  window.MathApp.Storage = S;
})();
