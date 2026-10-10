
/* =========================================
   HIDDENNEPAL — INTERACTIVE FEATURES
========================================= */

const slider = document.getElementById("sliderWindow");
const destinationTrack = document.getElementById("destinationTrack");
const extraDestinations = document.getElementById("extraDestinations");
const exploreAllBtn = document.getElementById("exploreAllBtn");

const budgetRange = document.getElementById("budgetRange");
const budgetValue = document.getElementById("budgetValue");
const budgetResult = document.getElementById("budgetResult");

const wishlistGrid = document.getElementById("wishlistGrid");
const wishlistCount = document.getElementById("wishlistCount");
const emptyWishlist = document.getElementById("emptyWishlist");

const detailsDialog = document.getElementById("detailsDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogCategory = document.getElementById("dialogCategory");
const dialogLocation = document.getElementById("dialogLocation");
const dialogDescription = document.getElementById("dialogDescription");
const dialogBudget = document.getElementById("dialogBudget");


/* =========================================
   1. DESTINATION INFORMATION
========================================= */

const destinationInfo = {
    "Khumai Danda": {
        location: "Kaski, Gandaki Province",
        category: "Mountains",
        budget: 1000,
        description:
            "Explore a Himalayan trekking destination with mountain " +
            "views and peaceful trails. Plan your route and check " +
            "local conditions before travelling."
    },

    "Kakani": {
        location: "Nuwakot, Bagmati Province",
        category: "Nature",
        budget: 500,
        description:
            "Enjoy green hills, fresh air and scenic viewpoints. " +
            "Kakani is an option for a short getaway from Kathmandu."
    },

    "Tinjure Milke Jaljale": {
        location: "Eastern Nepal",
        category: "Nature",
        budget: 1500,
        description:
            "Discover forest trails, seasonal rhododendron landscapes " +
            "and mountain scenery in eastern Nepal."
    },

    "Mardi Himal": {
        location: "Kaski, Gandaki Province",
        category: "Adventure",
        budget: 3000,
        description:
            "Follow a Himalayan trekking route through forested paths " +
            "and mountain viewpoints in the Annapurna region."
    },

    "Rara Lake": {
        location: "Mugu, Karnali Province",
        category: "Lakes",
        budget: 4000,
        description:
            "Discover a beautiful high-altitude lake surrounded by " +
            "forests and mountains. Transport and accommodation " +
            "require careful planning."
    },

    "Bandipur": {
        location: "Tanahun, Gandaki Province",
        category: "Culture",
        budget: 1500,
        description:
            "Explore a traditional hilltop town known for heritage " +
            "architecture, local culture and scenic walks."
    },

    "Shivapuri": {
        location: "Kathmandu Valley",
        category: "Nature",
        budget: 500,
        description:
            "Escape into forest trails and natural scenery near " +
            "Kathmandu. Check park entry requirements before visiting."
    },

    "Humla": {
        location: "Humla, Karnali Province",
        category: "Mountains",
        budget: 3000,
        description:
            "Discover remote Himalayan landscapes, traditional villages " +
            "and mountain trails in northwestern Nepal. Plan transport " +
            "and accommodation carefully."
    },

    "Gosaikunda": {
        location: "Rasuwa, Bagmati Province",
        category: "Lakes",
        budget: 2000,
        description:
            "Visit a high-altitude sacred lake surrounded by mountains. " +
            "Prepare for cold weather, altitude and changing trail conditions."
    },

    "Ilam": {
        location: "Eastern Nepal",
        category: "Nature",
        budget: 1500,
        description:
            "Enjoy rolling green hills, tea gardens, quiet roads and " +
            "a relaxed atmosphere in eastern Nepal."
    },

    "Pikey Peak": {
        location: "Solukhumbu, Koshi Province",
        category: "Adventure",
        budget: 2500,
        description:
            "Discover a trekking destination with wide Himalayan " +
            "panoramas and quieter walking routes."
    },

    "Phulchowki": {
        location: "Lalitpur, Bagmati Province",
        category: "Nature",
        budget: 500,
        description:
            "Explore forested hills south of Kathmandu, with opportunities " +
            "for hiking, nature observation and birdwatching."
    }
};


/* =========================================
   2. GET ALL DESTINATION CARDS
========================================= */

function getAllCards() {
    return Array.from(document.querySelectorAll(
        "#destinationTrack .card, " +
        "#extraDestinations .card"
    ));
}

function getAllDestinationNames() {
    return getAllCards().map(function (card) {
        return card.dataset.place;
    });
}

function formatNPR(amount) {
    return "NPR " + Number(amount).toLocaleString("en-IN");
}


/* =========================================
   3. HORIZONTAL DRAG SLIDER
========================================= */

let isDragging = false;
let startX = 0;
let startingScroll = 0;
let dragDistance = 0;
let suppressClick = false;

slider.addEventListener("mousedown", function (event) {
    if (event.button !== 0) return;
    if (event.target.closest("button")) return;

    isDragging = true;
    dragDistance = 0;
    startX = event.clientX;
    startingScroll = slider.scrollLeft;

    slider.classList.add("dragging");
});

document.addEventListener("mousemove", function (event) {
    if (!isDragging) return;

    const distance = event.clientX - startX;

    dragDistance = Math.max(
        dragDistance,
        Math.abs(distance)
    );

    if (dragDistance > 5) {
        slider.scrollLeft = startingScroll - distance;
    }
});

function stopDragging() {
    if (!isDragging) return;

    isDragging = false;
    slider.classList.remove("dragging");

    if (dragDistance > 6) {
        suppressClick = true;

        // Reset after the browser finishes processing the click.
        requestAnimationFrame(function () {
            suppressClick = false;
        });
    }
}

document.addEventListener("mouseup", stopDragging);
window.addEventListener("blur", stopDragging);

slider.addEventListener("click", function (event) {
    if (suppressClick) {
        event.preventDefault();
        event.stopPropagation();
    }
}, true);

// Mobile users can swipe naturally using touch scrolling.


/* =========================================
   4. EXPLORE ALL DESTINATIONS
========================================= */

exploreAllBtn.addEventListener("click", function () {
    const opening = extraDestinations.hidden;

    extraDestinations.hidden = !opening;

    exploreAllBtn.setAttribute(
        "aria-expanded",
        String(opening)
    );

    exploreAllBtn.innerHTML = opening
        ? 'Show Fewer Destinations <span>↑</span>'
        : 'Explore All Destinations <span>↓</span>';

    if (opening) {
        extraDestinations.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});


/* =========================================
   5. CATEGORY FILTERS
========================================= */

let selectedCategory = "All";

const categoryFilters = document.getElementById("categoryFilters");
const featuredCount = document.getElementById("featuredCount");

categoryFilters.addEventListener("click", function (event) {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    selectedCategory = button.dataset.category;

    categoryFilters.querySelectorAll(".filter-btn").forEach(
        function (filterButton) {
            const active =
                filterButton === button;

            filterButton.classList.toggle("active", active);
            filterButton.setAttribute("aria-pressed", String(active));
        }
    );

    applyFilters();
});

function applyFilters() {
    let featuredVisible = 0;

    getAllCards().forEach(function (card) {
        const category = card.dataset.category;
        const categoryMatches =
            selectedCategory === "All" ||
            category === selectedCategory;

        const budgetMatches =
            Number(card.dataset.budget) <= Number(budgetRange.value);

        const matches = categoryMatches && budgetMatches;

        card.hidden = !matches;

        if (
            matches &&
            card.closest("#destinationTrack")
        ) {
            featuredVisible++;
        }
    });

    featuredCount.textContent =
        String(featuredVisible).padStart(2, "0") +
        " featured destinations";

    // If filtering leaves no featured cards, show a helpful message.
    let emptyMessage = document.getElementById("noFeaturedResults");

    if (!emptyMessage) {
        emptyMessage = document.createElement("p");
        emptyMessage.id = "noFeaturedResults";
        emptyMessage.className = "empty-wishlist";
        emptyMessage.textContent =
            "No featured destinations match these filters. " +
            "Try another category or budget.";
        slider.insertAdjacentElement("afterend", emptyMessage);
    }

    emptyMessage.hidden = featuredVisible > 0;

    slider.scrollLeft = 0;
}


/* =========================================
   6. BUDGET EXPLORER
========================================= */

function updateBudget() {
    const budget = Number(budgetRange.value);

    budgetValue.textContent = formatNPR(budget);

    const matchingNames = getAllCards()
        .filter(function (card) {
            return (
                Number(card.dataset.budget) <= budget &&
                (
                    selectedCategory === "All" ||
                    card.dataset.category === selectedCategory
                )
            );
        })
        .map(function (card) {
            return card.dataset.place;
        });

    if (matchingNames.length === 0) {
        budgetResult.textContent =
            "No destinations match this budget and category. Try increasing your budget.";
    } else {
        budgetResult.textContent =
            matchingNames.length +
            (matchingNames.length === 1
                ? " destination fits"
                : " destinations fit") +
            " your budget.";
    }

    applyFilters();
}

budgetRange.addEventListener("input", updateBudget);

document.getElementById("resetBudget").addEventListener(
    "click",
    function () {
        budgetRange.value = 5000;
        updateBudget();
    }
);


/* =========================================
   7. WISHLIST STORAGE
========================================= */

const WISHLIST_KEY = "hiddenNepalWishlist";

let wishlist = [];

try {
    const stored = JSON.parse(
        localStorage.getItem(WISHLIST_KEY) || "[]"
    );

    if (Array.isArray(stored)) {
        wishlist = stored.filter(function (name) {
            return typeof name === "string" &&
                Object.prototype.hasOwnProperty.call(
                    destinationInfo,
                    name
                );
        });
    }
} catch (error) {
    wishlist = [];
}

function saveWishlist() {
    try {
        localStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify(wishlist)
        );
    } catch (error) {
        // Wishlist still works for this page session.
    }
}

function updateWishlistButtons() {
    getAllCards().forEach(function (card) {
        const name = card.dataset.place;
        const button = card.querySelector(".wish-btn");

        if (!button) return;

        const saved = wishlist.includes(name);

        button.classList.toggle("saved", saved);
        button.setAttribute("aria-pressed", String(saved));

        button.innerHTML = saved ? "♥" : "♡";
        button.setAttribute(
            "aria-label",
            (saved ? "Remove " : "Add ") +
            name +
            (saved ? " from" : " to") +
            " wishlist"
        );
    });

    wishlistCount.textContent = wishlist.length;
}

function renderWishlist() {
    wishlistGrid.replaceChildren();

    wishlist.forEach(function (name) {
        const sourceCard = getAllCards().find(function (card) {
            return card.dataset.place === name;
        });

        if (!sourceCard) return;

        const clone = sourceCard.cloneNode(true);

        clone.hidden = false;
        clone.classList.add("wishlist-card");

        // A wishlist card should remain visible even when
        // the main destination list is filtered.
        const heart = clone.querySelector(".wish-btn");

        if (heart) {
            heart.classList.add("saved");
            heart.innerHTML = "♥";
            heart.setAttribute("aria-pressed", "true");
        }

        wishlistGrid.appendChild(clone);
    });

    emptyWishlist.hidden = wishlist.length > 0;

    updateWishlistButtons();
}

document.addEventListener("click", function (event) {
    const heart = event.target.closest(".wish-btn");

    if (!heart) return;

    const card = heart.closest(".card");
    if (!card) return;

    const name = card.dataset.place;
    if (!name) return;

    if (wishlist.includes(name)) {
        wishlist = wishlist.filter(function (item) {
            return item !== name;
        });
    } else {
        wishlist.push(name);
    }

    saveWishlist();
    renderWishlist();
});


/* =========================================
   8. DESTINATION DETAILS POPUP
========================================= */

document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-open-details]");

    if (!button) return;

    const name = button.dataset.openDetails;
    const place = destinationInfo[name];

    if (!place) return;

    dialogTitle.textContent = name;
    dialogCategory.textContent = place.category;
    dialogLocation.textContent = "⌖ " + place.location;
    dialogDescription.textContent = place.description;

    dialogBudget.textContent =
        "Illustrative starting budget: " +
        formatNPR(place.budget) +
        "+";

    if (!detailsDialog.open) {
        detailsDialog.showModal();
    }
});

document.getElementById("closeDialog").addEventListener(
    "click",
    function () {
        detailsDialog.close();
    }
);

document.getElementById("dialogDone").addEventListener(
    "click",
    function () {
        detailsDialog.close();
    }
);

detailsDialog.addEventListener("click", function (event) {
    if (event.target === detailsDialog) {
        detailsDialog.close();
    }
});


/* =========================================
   9. INITIALIZE THE WEBSITE
========================================= */

updateWishlistButtons();
renderWishlist();
updateBudget();