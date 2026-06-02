(function () {
  var App = {};
  var currentPage = "home";
  var currentGrade = null;
  var currentSemester = null;
  var currentTopic = null;
  var questions = [];
  var currentQIndex = 0;
  var correctCount = 0;
  var answered = false;

  var catMessages = [
    "加油加油！🐱",
    "你真棒！继续保持～",
    "数学小达人就是你！",
    "再来一题吧！",
    "细心一点哦～",
    "今天也要元气满满！",
    "认真思考，你会的！",
    "错了没关系，再试试！"
  ];

  function $(id) { return document.getElementById(id); }

  function renderMath(el) {
    if (!window.katex) return;
    var html = el.innerHTML;
    var result = html.replace(/\$\$([\s\S]*?)\$\$/g, function (match, latex) {
      try {
        return katex.renderToString(latex.trim(), { throwOnError: false, displayMode: false });
      } catch (e) {
        return match;
      }
    });
    if (result !== html) el.innerHTML = result;
  }

  function renderMathAll(root) {
    if (!window.katex) return;
    renderMath(root);
  }

  function showPage(page) {
    var pages = document.querySelectorAll(".page");
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove("active");
    }
    $(page).classList.add("active");
    currentPage = page;
    window.scrollTo(0, 0);
  }

  function renderHome() {
    var stats = MathApp.Storage.getStats();
    $("stat-correct").textContent = stats.totalCorrect;
    $("stat-total").textContent = stats.totalQuestions;
    $("stat-accuracy").textContent = stats.accuracy + "%";
    $("stat-wrong").textContent = stats.wrongCount;

    var grades = MathApp.DATA.grades;
    var html = "";
    for (var i = 0; i < grades.length; i++) {
      var g = grades[i];
      var totalQ = 0, totalC = 0;
      for (var si = 0; si < g.semesters.length; si++) {
        for (var ti = 0; ti < g.semesters[si].topics.length; ti++) {
          var p = MathApp.Storage.getProgress(g.semesters[si].topics[ti].id);
          totalQ += p.total;
          totalC += p.correct;
        }
      }
      var pct = totalQ > 0 ? Math.round(totalC / totalQ * 100) : 0;
      html += '<div class="grade-card" style="--grade-color:' + g.color + '" onclick="MathApp.App.selectGrade(' + g.id + ')">';
      html += '<div class="grade-icon">' + g.icon + '</div>';
      html += '<div class="grade-name">' + g.name + '</div>';
      html += '<div class="grade-progress">已练习' + totalQ + '题 · 正确率' + pct + '%</div>';
      html += '<div class="progress-bar-mini"><div class="fill" style="width:' + pct + '%"></div></div>';
      html += '</div>';
    }
    $("grade-grid").innerHTML = html;
    showPage("page-home");
  }

  function renderGrade(gradeId) {
    var grades = MathApp.DATA.grades;
    var grade = null;
    for (var i = 0; i < grades.length; i++) {
      if (grades[i].id === gradeId) { grade = grades[i]; break; }
    }
    if (!grade) return;
    currentGrade = grade;

    $("grade-title").textContent = grade.icon + " " + grade.name + "数学（北师大版）";

    var tabs = "";
    for (var si = 0; si < grade.semesters.length; si++) {
      var s = grade.semesters[si];
      tabs += '<button class="semester-tab' + (si === 0 ? " active" : "") + '" onclick="MathApp.App.selectSemester(\'' + s.id + '\', this)">' + s.name + '</button>';
    }
    $("semester-tabs").innerHTML = tabs;

    renderSemester(grade.semesters[0].id);
    showPage("page-grade");
  }

  function renderSemester(semId) {
    var semester = null;
    for (var i = 0; i < currentGrade.semesters.length; i++) {
      if (currentGrade.semesters[i].id === semId) {
        semester = currentGrade.semesters[i];
        currentSemester = semester;
        break;
      }
    }
    if (!semester) return;

    var html = "";
    for (var ti = 0; ti < semester.topics.length; ti++) {
      var t = semester.topics[ti];
      var p = MathApp.Storage.getProgress(t.id);
      var pct = p.total > 0 ? Math.round(p.correct / p.total * 100) : 0;
      html += '<div class="topic-card" onclick="MathApp.App.selectTopic(\'' + t.id + '\')">';
      html += '<div class="topic-num">' + (ti + 1) + '</div>';
      html += '<div class="topic-info">';
      html += '<div class="topic-name">' + t.name;
      if (p.total > 0) {
        html += ' <span class="difficulty-badge ' + (pct >= 80 ? "easy" : pct >= 50 ? "medium" : "hard") + '">' + pct + '%</span>';
      }
      html += '</div>';
      html += '<div class="topic-desc">' + t.desc + '</div>';
      html += '</div>';
      html += '<div class="topic-arrow">›</div>';
      html += '</div>';
    }
    $("topic-list").innerHTML = html;
  }

  function findTopic(topicId) {
    var grades = MathApp.DATA.grades;
    for (var gi = 0; gi < grades.length; gi++) {
      for (var si = 0; si < grades[gi].semesters.length; si++) {
        for (var ti = 0; ti < grades[gi].semesters[si].topics.length; ti++) {
          if (grades[gi].semesters[si].topics[ti].id === topicId) {
            return grades[gi].semesters[si].topics[ti];
          }
        }
      }
    }
    return null;
  }

  function startPractice(topicId, count) {
    var topic = findTopic(topicId);
    if (!topic) return;
    currentTopic = topic;
    count = count || 5;
    questions = MathApp.Engine.generate(topic.type, count);
    currentQIndex = 0;
    correctCount = 0;
    answered = false;

    $("practice-title").textContent = topic.name;
    showPage("page-practice");
    renderQuestion();
  }

  function renderQuestion() {
    if (currentQIndex >= questions.length) {
      showResult();
      return;
    }

    var q = questions[currentQIndex];
    $("question-counter").textContent = (currentQIndex + 1) + " / " + questions.length;
    $("question-text").innerHTML = q.question;
    renderMath($("question-text"));
    answered = false;
    $("feedback-area").style.display = "none";
    $("feedback-area").className = "feedback-area";

    if (q.type === "choice") {
      var choicesHtml = '<div class="choices-grid">';
      var labels = ["A", "B", "C", "D"];
      for (var i = 0; i < q.choices.length; i++) {
        choicesHtml += '<button class="choice-btn" data-idx="' + i + '" onclick="MathApp.App.selectChoice(' + i + ')">';
        choicesHtml += labels[i] + ". " + q.choices[i];
        choicesHtml += '</button>';
      }
      choicesHtml += '</div>';
      $("answer-area").innerHTML = choicesHtml;
      renderMathAll($("answer-area"));
    } else {
      var fillHtml = '<div class="fill-answer">';
      fillHtml += '<input type="text" class="fill-input" id="fill-input" placeholder="输入答案" autocomplete="off">';
      fillHtml += '<button class="submit-btn" onclick="MathApp.App.submitFill()">确定</button>';
      fillHtml += '</div>';
      $("answer-area").innerHTML = fillHtml;
      setTimeout(function () {
        var input = $("fill-input");
        if (input) {
          input.focus();
          input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") MathApp.App.submitFill();
          });
        }
      }, 100);
    }
  }

  function selectChoice(idx) {
    if (answered) return;
    answered = true;

    var q = questions[currentQIndex];
    var userAnswer = q.choices[idx];
    var correctIdx = q.choices.indexOf(q.answer);
    var btns = document.querySelectorAll(".choice-btn");

    for (var i = 0; i < btns.length; i++) {
      btns[i].style.pointerEvents = "none";
    }

    if (String(userAnswer) === String(q.answer)) {
      btns[idx].classList.add("correct");
      correctCount++;
      showFeedback(true, q.hint);
    } else {
      btns[idx].classList.add("wrong");
      if (correctIdx >= 0) btns[correctIdx].classList.add("show-correct");
      MathApp.Storage.addWrong(q.question, userAnswer, q.answer, currentTopic ? currentTopic.id : "");
      showFeedback(false, q.hint);
    }
  }

  function submitFill() {
    if (answered) return;
    var input = $("fill-input");
    if (!input) return;
    var userAnswer = input.value.trim();
    if (!userAnswer) return;

    answered = true;
    var q = questions[currentQIndex];
    var isCorrect = String(userAnswer) === String(q.answer);

    input.disabled = true;
    var submitBtn = document.querySelector(".submit-btn");
    if (submitBtn) submitBtn.disabled = true;

    if (isCorrect) {
      input.classList.add("correct");
      correctCount++;
      showFeedback(true, q.hint);
    } else {
      input.classList.add("wrong");
      MathApp.Storage.addWrong(q.question, userAnswer, q.answer, currentTopic ? currentTopic.id : "");
      showFeedback(false, q.hint);
    }
  }

  function showFeedback(isCorrect, hint) {
    var fb = $("feedback-area");
    fb.style.display = "block";
    fb.className = "feedback-area " + (isCorrect ? "correct" : "wrong");
    fb.innerHTML = '<div class="feedback-icon">' + (isCorrect ? "✓" : "✗") + '</div>' +
      '<div class="feedback-text">' + (isCorrect ? "回答正确！" : "答错了～") + '</div>' +
      (hint ? '<div class="feedback-hint">💡 ' + hint + '</div>' : '') +
      '<button class="next-btn" onclick="MathApp.App.nextQuestion()">' +
      (currentQIndex < questions.length - 1 ? "下一题" : "查看结果") + '</button>';
    renderMath(fb);
  }

  function nextQuestion() {
    currentQIndex++;
    renderQuestion();
  }

  function showResult() {
    var total = questions.length;
    var pct = Math.round(correctCount / total * 100);
    var cls = pct >= 90 ? "excellent" : pct >= 70 ? "good" : pct >= 50 ? "fair" : "poor";
    var labels = { excellent: "太厉害了！", good: "做得不错！", fair: "继续努力！", poor: "还需加油哦！" };

    $("result-score").textContent = pct + "%";
    $("result-score").className = "result-score " + cls;
    $("result-label").textContent = labels[cls];
    $("correct-num").textContent = correctCount;
    $("wrong-num").textContent = total - correctCount;

    if (currentTopic) {
      MathApp.Storage.updateProgress(currentTopic.id, correctCount, total);
    }

    var wrongQuestions = [];
    for (var i = 0; i < questions.length; i++) {
    }

    showPage("page-result");
  }

  function renderWrongList() {
    var wrongList = MathApp.Storage.getWrongList();
    $("wrong-count-badge").textContent = wrongList.length + "题";

    if (wrongList.length === 0) {
      $("wrong-list-container").innerHTML = '<div class="empty-state"><div class="empty-icon">🎉</div><p>没有错题，继续保持！</p></div>';
    } else {
      var html = '<div class="wrong-list">';
      for (var i = wrongList.length - 1; i >= 0; i--) {
        var w = wrongList[i];
        html += '<div class="wrong-item">';
        html += '<div class="wrong-q">' + w.question + '</div>';
        html += '<div><span class="wrong-a">你的答案：' + w.userAnswer + '</span>';
        html += '<span class="correct-a">正确答案：' + w.correctAnswer + '</span></div>';
        html += '</div>';
      }
      html += '</div>';
      $("wrong-list-container").innerHTML = html;
      renderMathAll($("wrong-list-container"));
    }
    showPage("page-wrong");
  }

  function renderProgress() {
    var allProgress = MathApp.Storage.getAllProgress();
    var grades = MathApp.DATA.grades;
    var html = "";

    for (var gi = 0; gi < grades.length; gi++) {
      for (var si = 0; si < grades[gi].semesters.length; si++) {
        for (var ti = 0; ti < grades[gi].semesters[si].topics.length; ti++) {
          var t = grades[gi].semesters[si].topics[ti];
          var p = allProgress[t.id];
          if (p && p.total > 0) {
            var pct = Math.round(p.correct / p.total * 100);
            var clr = pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--accent)" : "var(--danger)";
            html += '<div class="progress-item">';
            html += '<div class="topic-name">' + grades[gi].name + "·" + t.name + '</div>';
            html += '<div class="progress-bar"><div class="fill" style="width:' + pct + '%;background:' + clr + '"></div></div>';
            html += '<div class="progress-text">' + p.correct + '/' + p.total + ' (' + pct + '%)</div>';
            html += '</div>';
          }
        }
      }
    }

    if (!html) {
      html = '<div class="empty-state"><div class="empty-icon">📊</div><p>还没有练习记录，快来做题吧！</p></div>';
    }

    $("progress-container").innerHTML = html;
    showPage("page-progress");
  }

  function showCatMessage() {
    var existing = document.querySelector(".cat-message");
    if (existing) existing.remove();

    var msg = document.createElement("div");
    msg.className = "cat-message";
    msg.textContent = catMessages[Math.floor(Math.random() * catMessages.length)];
    document.body.appendChild(msg);

    setTimeout(function () {
      if (msg.parentNode) msg.remove();
    }, 2500);
  }

  App.init = function () {
    showPage("page-home");
    renderHome();

    document.querySelector(".cat-mascot").addEventListener("click", showCatMessage);

    setTimeout(showCatMessage, 1500);
  };

  App.goHome = function () {
    renderHome();
  };

  App.selectGrade = function (gradeId) {
    renderGrade(gradeId);
  };

  App.selectSemester = function (semId, btn) {
    var tabs = document.querySelectorAll(".semester-tab");
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove("active");
    btn.classList.add("active");
    renderSemester(semId);
  };

  App.selectTopic = function (topicId) {
    startPractice(topicId, 5);
  };

  App.selectChoice = function (idx) {
    selectChoice(idx);
  };

  App.submitFill = function () {
    submitFill();
  };

  App.nextQuestion = function () {
    nextQuestion();
  };

  App.showWrong = function () {
    renderWrongList();
  };

  App.showProgress = function () {
    renderProgress();
  };

  App.clearWrong = function () {
    if (confirm("确定清除所有错题记录吗？")) {
      MathApp.Storage.clearWrong();
      renderWrongList();
    }
  };

  App.retryWrong = function () {
    var wrongList = MathApp.Storage.getWrongList();
    if (wrongList.length === 0) return;

    questions = [];
    for (var i = 0; i < Math.min(wrongList.length, 10); i++) {
      var w = wrongList[i];
      questions.push({
        question: w.question,
        answer: w.correctAnswer,
        hint: "这是之前的错题",
        type: "fill"
      });
    }
    currentQIndex = 0;
    correctCount = 0;
    currentTopic = { id: "wrong_retry", name: "错题重练" };
    $("practice-title").textContent = "错题重练";
    showPage("page-practice");
    renderQuestion();
  };

  App.startQuickQuiz = function (gradeId, count) {
    var grades = MathApp.DATA.grades;
    var grade = null;
    for (var i = 0; i < grades.length; i++) {
      if (grades[i].id === gradeId) { grade = grades[i]; break; }
    }
    if (!grade) return;

    var allTopics = [];
    for (var si = 0; si < grade.semesters.length; si++) {
      for (var ti = 0; ti < grade.semesters[si].topics.length; ti++) {
        allTopics.push(grade.semesters[si].topics[ti]);
      }
    }

    questions = [];
    count = count || 10;
    for (var qi = 0; qi < count; qi++) {
      var topic = allTopics[Math.floor(Math.random() * allTopics.length)];
      var qs = MathApp.Engine.generate(topic.type, 1);
      questions.push(qs[0]);
    }
    currentQIndex = 0;
    correctCount = 0;
    currentTopic = { id: "quiz_" + gradeId, name: grade.name + "综合测验" };
    $("practice-title").textContent = grade.name + "综合测验";
    showPage("page-practice");
    renderQuestion();
  };

  window.MathApp = window.MathApp || {};
  window.MathApp.App = App;
})();
