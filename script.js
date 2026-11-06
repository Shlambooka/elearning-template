const courses = [
    { id: 1, title: "HTML Basics", content: "HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages." },
    { id: 2, title: "CSS Fundamentals", content: "CSS stands for Cascading Style Sheets. It describes how HTML elements are to be displayed on screen." },
    { id: 3, title: "JavaScript Intro", content: "JavaScript is a programming language that enables you to create dynamically updating content and control multimedia." }
];

const courseListEl = document.getElementById('course-list');
const lessonTitleEl = document.getElementById('lesson-title');
const lessonContentEl = document.getElementById('lesson-content');
const completeBtn = document.getElementById('complete-btn');
const progressStatus = document.getElementById('progress-status');

let currentCourseId = null;

// Read progress from localStorage
function getProgress() {
    return JSON.parse(localStorage.getItem('courseProgress')) || [];
}

// Render course list
function renderCourses() {
    const progress = getProgress();
    // Keep the h2 heading, remove old course items
    const items = courseListEl.querySelectorAll('.course-item');
    items.forEach(el => el.remove());

    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'course-item';
        if (progress.includes(course.id)) div.classList.add('completed');
        div.textContent = course.title;
        div.onclick = () => loadLesson(course);
        courseListEl.appendChild(div);
    });
}

function loadLesson(course) {
    currentCourseId = course.id;
    lessonTitleEl.textContent = course.title;
    lessonContentEl.textContent = course.content;
    completeBtn.style.display = 'block';
    
    const progress = getProgress();
    if (progress.includes(course.id)) {
        completeBtn.textContent = '✅ Completed';
        completeBtn.disabled = true;
        progressStatus.textContent = 'You have already completed this lesson.';
    } else {
        completeBtn.textContent = 'Mark as Complete';
        completeBtn.disabled = false;
        progressStatus.textContent = '';
    }
}

completeBtn.onclick = () => {
    if (!currentCourseId) return;
    const progress = getProgress();
    if (!progress.includes(currentCourseId)) {
        progress.push(currentCourseId);
        localStorage.setItem('courseProgress', JSON.stringify(progress));
        renderCourses();
        completeBtn.textContent = '✅ Completed';
        completeBtn.disabled = true;
        progressStatus.textContent = 'Great job! Progress saved.';
    }
};

// Initialization
renderCourses();
