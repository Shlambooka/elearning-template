/* ============================================================
   Feedback Loops Course — main.js
   All behavior in one file. Each block's init function is a
   self-contained region. When you add a new block:
     1. add a new #region below (e.g. "Flip Card"),
     2. add one line to the bootstrap call at the top.
   ============================================================ */


// #region Bootstrap — wire up all blocks on page load
//
// Every block needs its init function called after the page
// HTML has loaded. This is the ONLY place you touch when you
// add a new block: add one line here.
document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initTabs();
  initFlipCards();
  initHotspots();
  initReveals();
  initMultiQuizzes();
  initSortables();
  initBranching();   // ← new
  initQuizzes();
});
// #endregion


// #region Accordion
//
// HTML contract:
//   <div class="accordion">
//     <div class="accordion-item">
//       <button class="accordion-trigger"
//               aria-expanded="false"
//               aria-controls="panel-1">Trigger text</button>
//       <div class="accordion-panel" id="panel-1" hidden>
//         Panel content
//       </div>
//     </div>
//   </div>
//
// What it does:
//   Finds every .accordion-trigger on the page. When clicked,
//   flips its aria-expanded (true/false) and toggles the
//   hidden attribute on the panel it points to via aria-controls.
//   The CSS styles the + / − icon based on aria-expanded.
function initAccordions() {
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));

      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });
}
// #endregion


// #region Tabs
//
// HTML contract:
//   <div class="tabs">
//     <div class="tab-list" role="tablist">
//       <button class="tab-button" role="tab"
//               aria-selected="true"
//               aria-controls="tab-panel-1"
//               id="tab-1">Tab one</button>
//       <button class="tab-button" role="tab"
//               aria-selected="false"
//               aria-controls="tab-panel-2"
//               id="tab-2" tabindex="-1">Tab two</button>
//     </div>
//     <div class="tab-panel" role="tabpanel"
//          id="tab-panel-1" aria-labelledby="tab-1">...</div>
//     <div class="tab-panel" role="tabpanel"
//          id="tab-panel-2" aria-labelledby="tab-2" hidden>...</div>
//   </div>
//
// Keyboard support (WAI-ARIA tabs pattern):
//   ← / →   move between tabs
//   Home    jump to first tab
//   End     jump to last tab
function initTabs() {
  const tabWidgets = document.querySelectorAll('.tabs');

  tabWidgets.forEach(widget => {
    const buttons = Array.from(widget.querySelectorAll('.tab-button'));
    const panels = Array.from(widget.querySelectorAll('.tab-panel'));
    if (!buttons.length) return;

    // Show exactly one panel, hide the rest, update aria state.
    function activate(index) {
      buttons.forEach((btn, i) => {
        const selected = i === index;
        btn.setAttribute('aria-selected', String(selected));
        btn.tabIndex = selected ? 0 : -1;
        panels[i].hidden = !selected;
      });
      buttons[index].focus();
    }

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => activate(i));

      btn.addEventListener('keydown', (e) => {
        let newIndex = null;
        if (e.key === 'ArrowRight') newIndex = (i + 1) % buttons.length;
        if (e.key === 'ArrowLeft')  newIndex = (i - 1 + buttons.length) % buttons.length;
        if (e.key === 'Home')       newIndex = 0;
        if (e.key === 'End')        newIndex = buttons.length - 1;

        if (newIndex !== null) {
          e.preventDefault();
          activate(newIndex);
        }
      });
    });
  });
}
// #endregion


// #region Knowledge Check (quiz)
//
// HTML contract:
//   <div class="quiz" data-answer="b">
//     <h3>Question text</h3>
//     <label class="quiz-option">
//       <input type="radio" name="q1" value="a"> Option A
//     </label>
//     ...
//     <button type="button" class="quiz-check">Check answer</button>
//     <p class="quiz-feedback" role="status"
//        aria-live="polite" hidden></p>
//   </div>
//
// What it does:
//   Finds every .quiz on the page. On button click, reads the
//   selected radio's value and compares it with the quiz's
//   data-answer attribute. Shows "correct" or "wrong" feedback.
//   The aria-live="polite" region announces the feedback to
//   screen readers automatically.
function initQuizzes() {
  const quizzes = document.querySelectorAll('.quiz');

  quizzes.forEach(quiz => {
    const button   = quiz.querySelector('.quiz-check');
    const feedback = quiz.querySelector('.quiz-feedback');
    const correctValue = quiz.dataset.answer;

    button.addEventListener('click', () => {
      const selected = quiz.querySelector('input[type="radio"]:checked');

      if (!selected) {
        feedback.hidden = false;
        feedback.className = 'quiz-feedback is-wrong';
        feedback.textContent = 'Pick an option first.';
        return;
      }

      const isCorrect = selected.value === correctValue;
      feedback.hidden = false;
      feedback.className = 'quiz-feedback ' + (isCorrect ? 'is-correct' : 'is-wrong');
      feedback.textContent = isCorrect
        ? 'Correct! Well done.'
        : 'Not quite. Try again — reread the section above if needed.';
    });
  });
}
// #endregion


// #region Flip Card
//
// HTML contract:
//   <div class="flip-cards">
//     <button class="flip-card" aria-pressed="false"
//             aria-label="Reveal definition of ...">
//       <div class="flip-card-inner">
//         <div class="flip-card-face flip-card-front">Front</div>
//         <div class="flip-card-face flip-card-back">Back</div>
//       </div>
//     </button>
//   </div>
//
// What it does:
//   Finds every .flip-card on the page. When clicked, toggles its
//   aria-pressed state. CSS watches aria-pressed and rotates the
//   inner wrapper 180° to show the back face.
//
// Why <button>: the whole card is one big button, so keyboard
// users can Tab to it and press Enter/Space. Screen readers
// announce it as "pressed / not pressed", which is the correct
// semantic for a toggle.
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const pressed = card.getAttribute('aria-pressed') === 'true';
      card.setAttribute('aria-pressed', String(!pressed));
    });
  });
}
// #endregion Flip Card


// #region Image Hotspot
//
// HTML contract:
//   <figure class="hotspot-figure">
//     <img class="hotspot-image" src="..." alt="...">
//     <button class="hotspot" aria-expanded="false"
//             aria-controls="hotspot-tip-1"
//             style="top: 20%; left: 30%;">1</button>
//     <div class="hotspot-tooltip" id="hotspot-tip-1" hidden
//          style="top: 30%; left: 30%;">Explanation</div>
//   </figure>
//
// What it does:
//   Finds every .hotspot button. On click, toggles its
//   aria-expanded state and shows/hides the tooltip it points
//   to via aria-controls. Only one tooltip open at a time per
//   figure — clicking a second hotspot closes the first.
function initHotspots() {
  const figures = document.querySelectorAll('.hotspot-figure');

  figures.forEach(figure => {
    const hotspots = Array.from(figure.querySelectorAll('.hotspot'));

    hotspots.forEach(button => {
      button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        // Close all tooltips in this figure first
        hotspots.forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
          const tip = document.getElementById(btn.getAttribute('aria-controls'));
          if (tip) tip.hidden = true;
        });

        // If this one was closed, open it
        if (!isOpen) {
          button.setAttribute('aria-expanded', 'true');
          const tip = document.getElementById(button.getAttribute('aria-controls'));
          if (tip) tip.hidden = false;
        }
      });
    });
  });
}
// #endregion Image Hotspot


// #region Reveal Button
//
// HTML contract:
//   <div class="reveal">
//     <button class="reveal-button" aria-expanded="false"
//             aria-controls="reveal-1">Show answer</button>
//     <div class="reveal-content" id="reveal-1" hidden>...</div>
//   </div>
//
// Simple toggle. Button shows/hides content. Label usually
// changes via CSS or you can leave it static — a static label
// is fine for one-off reveals.
function initReveals() {
  const buttons = document.querySelectorAll('.reveal-button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const content = document.getElementById(button.getAttribute('aria-controls'));
      button.setAttribute('aria-expanded', String(!expanded));
      content.hidden = expanded;
    });
  });
}
// #endregion


// #region Multi-Select Quiz
//
// HTML contract:
//   <div class="multiquiz" data-correct="a,c">
//     <h3>Question</h3>
//     <label class="multiquiz-option">
//       <input type="checkbox" name="mq1" value="a"> Option A
//     </label>
//     ...
//     <button type="button" class="multiquiz-check">Check</button>
//     <p class="multiquiz-feedback" role="status"
//        aria-live="polite" hidden></p>
//   </div>
//
// data-correct is a comma-separated list of every correct
// option's value. On check, marks each option correct/wrong
// and gives overall feedback:
//   all selected are correct AND all correct are selected → correct
//   some right, some wrong → partial
//   otherwise → wrong
function initMultiQuizzes() {
  const quizzes = document.querySelectorAll('.multiquiz');
  quizzes.forEach(quiz => {
    const button = quiz.querySelector('.multiquiz-check');
    const feedback = quiz.querySelector('.multiquiz-feedback');
    const correctSet = new Set(
      (quiz.dataset.correct || '').split(',').map(s => s.trim()).filter(Boolean)
    );

    button.addEventListener('click', () => {
      const inputs = Array.from(quiz.querySelectorAll('input[type="checkbox"]'));
      const selected = new Set(inputs.filter(i => i.checked).map(i => i.value));

      // Reset previous styling
      inputs.forEach(input => {
        input.closest('.multiquiz-option').classList.remove('is-correct', 'is-wrong');
      });

      let hits = 0, misses = 0, falsePositives = 0;
      inputs.forEach(input => {
        const label = input.closest('.multiquiz-option');
        const isCorrect = correctSet.has(input.value);
        const isSelected = selected.has(input.value);

        if (isCorrect && isSelected) { hits++; label.classList.add('is-correct'); }
        else if (isCorrect && !isSelected) { misses++; label.classList.add('is-correct'); }
        else if (!isCorrect && isSelected) { falsePositives++; label.classList.add('is-wrong'); }
      });

      feedback.hidden = false;
      if (hits === correctSet.size && falsePositives === 0) {
        feedback.className = 'multiquiz-feedback is-correct';
        feedback.textContent = 'Correct — you got all of them.';
      } else if (hits > 0 && falsePositives === 0) {
        feedback.className = 'multiquiz-feedback is-partial';
        feedback.textContent = `Almost — you found ${hits} of ${correctSet.size}. Keep looking for the rest.`;
      } else {
        feedback.className = 'multiquiz-feedback is-wrong';
        feedback.textContent = 'Not quite. Correct answers are highlighted in green.';
      }
    });
  });
}
// #endregion


// #region Sortable List
//
// HTML contract:
//   <ol class="sortable" data-answer="a,b,c">
//     <li class="sortable-item" data-id="a">
//       <span class="sortable-handle" aria-hidden="true">⋮⋮</span>
//       Item text
//     </li>
//     ...
//   </ol>
//   <div class="sortable-actions">
//     <button class="sortable-check">Check order</button>
//     <button class="sortable-reset is-secondary">Reset</button>
//   </div>
//   <p class="sortable-feedback" role="status"
//      aria-live="polite" hidden></p>
//
// data-answer = the correct order, comma-separated data-ids.
//
// Drag: uses HTML5 drag events on mouse. Keyboard: each item
// has a Move Up / Move Down via Alt+Arrow keys when focused —
// see initSortablesKeyboard.
function initSortables() {
  const lists = document.querySelectorAll('.sortable');

  lists.forEach(list => {
    const items = () => Array.from(list.querySelectorAll('.sortable-item'));

    // ----- Mouse / pointer drag -----
    items().forEach(item => {
      item.draggable = true;

      item.addEventListener('dragstart', e => {
        item.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('is-dragging');
        items().forEach(i => i.classList.remove('is-over'));
      });
      item.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        items().forEach(i => i.classList.remove('is-over'));
        item.classList.add('is-over');
      });
      item.addEventListener('drop', e => {
        e.preventDefault();
        const dragging = list.querySelector('.is-dragging');
        if (!dragging || dragging === item) return;
        // Insert dragging element before or after the target
        const rect = item.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        if (e.clientY < midpoint) {
          list.insertBefore(dragging, item);
        } else {
          list.insertBefore(dragging, item.nextSibling);
        }
      });
    });

    // ----- Keyboard reorder: Alt+Up / Alt+Down -----
    items().forEach(item => {
      item.tabIndex = 0;
      item.addEventListener('keydown', e => {
        if (!e.altKey) return;
        if (e.key === 'ArrowUp') {
          const prev = item.previousElementSibling;
          if (prev) { list.insertBefore(item, prev); item.focus(); e.preventDefault(); }
        }
        if (e.key === 'ArrowDown') {
          const next = item.nextElementSibling;
          if (next) { list.insertBefore(next, item); item.focus(); e.preventDefault(); }
        }
      });
    });

    // ----- Check / reset -----
    const checkBtn = document.querySelector(`#${list.id}-check`);
    const resetBtn = document.querySelector(`#${list.id}-reset`);
    const feedback = document.querySelector(`#${list.id}-feedback`);
    const correctOrder = (list.dataset.answer || '').split(',').map(s => s.trim());

    if (checkBtn && feedback) {
      checkBtn.addEventListener('click', () => {
        const currentOrder = items().map(i => i.dataset.id);
        const isCorrect = currentOrder.every((id, i) => id === correctOrder[i]);
        feedback.hidden = false;
        feedback.className = 'sortable-feedback ' + (isCorrect ? 'is-correct' : 'is-wrong');
        feedback.textContent = isCorrect
          ? 'Correct order!'
          : 'Not quite — try again, or use Reset to start fresh.';
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        // Sort back to original DOM order — captured on init
        const original = items().map(i => i.dataset.id);
        // Rebuild from the original sequence preserved on first init
        if (list._originalOrder) {
          list._originalOrder.forEach(id => {
            const el = list.querySelector(`.sortable-item[data-id="${id}"]`);
            if (el) list.appendChild(el);
          });
        }
        if (feedback) feedback.hidden = true;
        items().forEach(i => i.focus === undefined || (i.tabIndex = 0));
      });
    }

    // Capture original order on init
    list._originalOrder = items().map(i => i.dataset.id);
  });
}
// #endregion


// #region Branching Choice
//
// HTML contract:
//   Scenario page (where the choice is made):
//     <div class="branch" data-scenario-id="deadline">
//       <p class="branch-prompt">What do you do?</p>
//       <div class="branch-options">
//         <a class="branch-option"
//            data-choice="a"
//            href="outcome-a.html">Option A</a>
//         <a class="branch-option"
//            data-choice="b"
//            href="outcome-b.html">Option B</a>
//       </div>
//     </div>
//
//   Outcome pages (where the choice is confirmed):
//     <div class="branch" data-scenario-id="deadline">
//       ... (same markup, same data-ids) ...
//     </div>
//
// What it does:
//   1. When a choice is clicked on a scenario page, stores
//      "scenario-id → choice" in localStorage so it survives
//      the page navigation.
//   2. When any page loads with a matching .branch, reads
//      localStorage and adds .is-chosen to the option that was
//      picked — so when the learner lands on the outcome page,
//      or returns to try again, they can see what they chose.
//
// Notes:
//   - No state is required. If localStorage is empty, nothing
//     is marked; the page still works.
//   - data-scenario-id must be unique per scenario. If two
//     scenarios share it, their choices overlap.
function initBranching() {
  const widgets = document.querySelectorAll('.branch');

  widgets.forEach(widget => {
    const scenarioId = widget.dataset.scenarioId;
    if (!scenarioId) return;

    const stored = localStorage.getItem(`branch:${scenarioId}`);
    if (stored) {
      const chosen = widget.querySelector(`.branch-option[data-choice="${stored}"]`);
      if (chosen) chosen.classList.add('is-chosen');
    }

    widget.querySelectorAll('.branch-option').forEach(option => {
      option.addEventListener('click', () => {
        localStorage.setItem(`branch:${scenarioId}`, option.dataset.choice);
      });
    });
  });
}
// #endregion