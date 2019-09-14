const defaultText = ";; This page is for quick notes. They will save and reappear upon closing and opening this file again.";
const textarea = document.getElementById("textarea");
const list = document.getElementById("list");

// Go from old "text" to new "#default"
if (localStorage["text"]) {
    localStorage["#default"] = localStorage["text"];
    delete localStorage["text"];
}

// Delete "#list" if present.
delete localStorage["#list"];

function run() {
    textarea.focus();
    window.onhashchange = function () {
        save(window.current);
        run();
    }

    window.current = getTarget();
    function save(target) {
        if (target === "#list") {
            return;
        }
        const textValue = textarea.value.trim();
        if (textValue === "" || textValue == defaultText.trim()) {
            delete localStorage[target];
        } else {
            localStorage[target] = textarea.value;
        }
    };

    function getTarget() {
        return target = window.location.hash || "#default";
    };

    // See if we have capabilities for Local Storage
    if (window.localStorage) {
        if (getTarget() === '#list') {
            const items = Object.keys(localStorage);
            items.sort();
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }

            for (const idx in items) {
                const item = items[idx];
                const a = document.createElement("a");
                a.href = item;
                a.innerText = item;
                const li = document.createElement("li");
                li.appendChild(a);
                list.appendChild(li);
            };

            textarea.style.display = "none";
            list.style.display = ""
            return;
        } else {
            // Load the text from storage if it exists
            textarea.value = localStorage[getTarget()] || defaultText;
            textarea.style.display = "";
            list.style.display = "none";
        }

        // Detect if page is closing and save everything.
        window.onbeforeunload = function () {
            save(getTarget());
        };
    }
    else {
        textarea.value = "You need a browser with Local Storage. Chrome or Firefox is recommended.";
    }
}

run();
