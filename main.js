/* jshint esversion: 6 */

/* * * * * * * * * * * 
 * Locomotive scroll *
 * * * * * * * * * * */

const dataScrollContainer = document.querySelector("[data-scroll-container]");
const anchorLinks = document.querySelectorAll("a[href^=\\#]:not([href$=\\#])");
const planetButton = document.querySelector(".planet-picker-btn");
const planetDropdown = document.querySelector(".planet-picker-dropdown");

// Initialise.
const locoScroll = new LocomotiveScroll({
    el: dataScrollContainer,
    smooth: true,
    smartphone: {
        smooth: true
    },
    tablet: {
        smooth: true
    }
});

// When elements change height, update Locomotive. Solution is adapted from MikeHantha (2022). 
// This is necessary as the quiz DOM elements change the page height. Locomotive calculates the page height when  
// initialised, so if it’s not updated when the height changes, it causes issues, such as cutting of the page early. 
new ResizeObserver(() => locoScroll.update()).observe(dataScrollContainer);

// Scroll to anchor links when they are clicked. Adapted from mykt0ngc0 (2022).  
// This is necessary as anchor links don’t function as expected with Locomotive. 
anchorLinks.forEach((anchorLink) => {
    const target = document.querySelector(anchorLink.getAttribute("href"));

    anchorLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        locoScroll.scrollTo(target);
        anchorLink.classList.remove("active");
        planetButton.classList.remove("show");
        planetDropdown.classList.remove("show");
    });
});

/* * * * * * * * * * * * * * 
 * Planet quiz and dialog  *
 * * * * * * * * * * * * * */

const quizQuestionArea = document.querySelector("#quiz-question-area");
const quizProgressBar = document.querySelector("#quiz-progress-bar");
const quizPercentageComplete = document.querySelector("#quiz-percentage-complete");
const quizProgressText = document.querySelector("#quiz-progress-text");
const nextButton = document.querySelector("#next-button");
const radios = document.querySelectorAll("input[type=radio]");
const dialog = document.querySelector("sl-dialog");
const closeButton = dialog.querySelector("#close-button");
const okButton = dialog.querySelector("#ok-button");
const tabs = document.getElementsByClassName("tab");
const quizPercentCorrect = document.querySelector("#quiz-percent-correct");
const quizResultsText = document.querySelector("#quiz-results-text");

const totalQuestions = tabs.length - 2;
const lastTab = tabs.length - 1;
let currentTab = 0;
const correctAnswers = ["Jupiter", "Mercury", "Venus", "Saturn", "Uranus"];

// Hide the current tab, get and display new tab.
function nextPreviousTab(number) {
    tabs[currentTab].style.display = "none";
    currentTab = currentTab + number;
    setUpCurrentTab();
    tabs[currentTab].style.display = "block";
}

// Set up elements for current tab.
function setUpCurrentTab() {

    // Show quiz question details on all tabs except first and last. 
    if (currentTab > 0 && currentTab < lastTab) {
        quizQuestionArea.style.display = "block";
        quizProgressBar.value = calculatePercentage(currentTab, totalQuestions);
        quizPercentageComplete.innerHTML = quizProgressBar.value + "%";
        quizProgressText.innerHTML = "Question " + currentTab + " of " + totalQuestions;

        // Display submit button on second last tab, otherwise display next button. 
        if (currentTab == tabs.length - 2) {
            nextButton.innerHTML = "Submit";

            nextButton.onclick = function () {
                dialog.show();
            };
        } else {
            nextButton.innerHTML = "Next";

            nextButton.onclick = function () { 
                nextPreviousTab(1); 
            };
        }
    } else {
        quizQuestionArea.style.display = "none";

        // Show results if on last tab.
        if (currentTab == lastTab) {
            const result = calculateResult();
            quizPercentCorrect.innerHTML = result;

            if (result < 50) {
                quizResultsText.innerHTML = "Exploring the cosmos is no easy feat. While the stars may not have " +
                    "aligned this time, your curiosity has laid the groundwork for a deeper understanding of the " +
                    "universe. Keep seeking knowledge, who knows what wonders you'll uncover next!";
            } else if (result < 100) {
                quizResultsText.innerHTML = "Congratulations, cosmic explorer! Your quiz results reflect a solid " +
                    "understanding of our planetary system. As you continue to learn and explore, your astronomical expertise is " +
                    "destined to shine even brighter, and you'll find yourself navigating the cosmos with increasing confidence.";
            } else {
                quizResultsText.innerHTML = "Behold, a celestial maestro! With a perfect score, you have ascended " +
                    "to the zenith of planetary expertise. Prepare to bask in the glory of your achievement as you now " +
                    "stand among the few who possess an unparalleled understanding of our amazing solar system.";
            }
        }
    }
}

// Calculate results by comparing checked radios against correct answers. 
function calculateResult() {
    let correct = 0;

    for (let i = 0; i <= totalQuestions; i++) {
        const question = document.querySelector("input[name='q" + i + "']:checked");

        if (question != null && question.value == correctAnswers[i]) {
            correct += 1;
        }
    }
    return calculatePercentage(correct, totalQuestions);
}

// Calculate partial value percentage out of total value.
function calculatePercentage(partialValue, totalValue) {
    return Math.round((partialValue / totalValue) * 100);
}

// Reset quiz answers and return to start.
// Called by the reset button on the last tab of quiz.
function reset() {
    uncheckAllRadioButtons();
    nextPreviousTab(-(lastTab));
}

// Loop all readios on the page and uncheck them. 
function uncheckAllRadioButtons() {
    for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }
}

// Stop scrollbar if dialog is open.
dialog.addEventListener("sl-show", () => {
    locoScroll.stop();
});

// Restart scrollbar when dialog is closed.
dialog.addEventListener("sl-hide", () => {
    locoScroll.start();
});

// Hide dialog when close button is pressed.
closeButton.addEventListener("click", () => {
    dialog.hide();
});

// Go to next tab if user confirms quiz sumission.
okButton.addEventListener("click", () => {
    nextPreviousTab(1);
    dialog.hide();
});

/* * * * * * * * * * 
 * Splide carousel *
 * * * * * * * * * */

// Declare all carousels.
const carousels = [
    "#jupiter-carousel",
    "#saturn-carousel",
    "#uranus-carousel",
    "#neptune-carousel",
    "#mars-carousel",
    "#earth-carousel",
    "#venus-carousel",
    "#mercury-carousel"
];

// Loop through all carousels and set up each one.
for (let i = 0; i < carousels.length; i++) {
    new Splide(carousels[i], {
        type: 'fade'
    }).mount();
}

/* * * * * 
 * Anime *
 * * * * */

const heroText = document.querySelector("#hero-text");

// Wrap each letter in span tag.
heroText.innerHTML = heroText.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

// Add animation to letters. Adapted from Bjerrome (n.d.). 
anime.timeline({
    loop: true
}).add({
    targets: "#hero-text .letter",
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 2250,
    delay: (el, i) => 50 * (i+1)
}).add({
    targets: heroText,
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 5000
});