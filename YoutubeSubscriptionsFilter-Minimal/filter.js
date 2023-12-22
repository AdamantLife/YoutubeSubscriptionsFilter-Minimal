let watcher = new MutationObserver(checkForSubscriptions);
watcher.observe(document, {childList: true, subtree: true});
var mutating = false;

function checkForSubscriptions() {
    let subscriptionsList = getSubscriptionsList();
    if(!subscriptionsList) return;
    watcher.disconnect();
    watcher = new MutationObserver(filterSubscriptions);
    subscriptionsList.insertAdjacentHTML('afterbegin', `<input></input>`);
    subscriptionsList.addEventListener('keyup', checkHotkeys);
    watcher.observe(subscriptionsList, {childList: true, subtree: true});
}

function checkHotkeys(event) {
    if(event.key == "Escape") {
        let subscriptionsList = getSubscriptionsList();
        subscriptionsList.querySelector("input").value = "";
    }
    filterSubscriptions();
}

function filterSubscriptions() {
    if(mutating) return;
    mutating = true;
    let subscriptionsList = getSubscriptionsList();
    let filter = subscriptionsList.querySelector("input").value;
    if(!filter || filter == "") {
        for(let i = 0; i < subscriptionsList.children.length; i++) {
            subscriptionsList.children[i].style.display = "block";
        }
        mutating = false;
        return;
    }
    let subscriptions = subscriptionsList.querySelectorAll("ytd-guide-entry-renderer");
    for(let i = 0; i < subscriptions.length; i++) {
        if(subscriptions[i].id == "expander-item") continue;
        let subscription = subscriptions[i];
        let title = subscription.querySelector("a[title]");
        title = title.getAttribute("title");
        if(title.toLowerCase().includes(filter.toLowerCase())) {
            subscription.style.display = "block";
        } else {
            subscription.style.display = "none";
        }
    }
    mutating = false;
}

function getSubscriptionsList() {
    let guidesections = document.querySelectorAll("ytd-guide-section-renderer:has(#guide-section-title)");
    let subscriptions;
    for(let i = 0; i < guidesections.length; i++) {
        let guidesectionTitle = guidesections[i].querySelector("#guide-section-title");
        if(guidesectionTitle.textContent == "Subscriptions") {
            subscriptions = guidesections[i];
            break;
        }
    }
    if(!subscriptions) return false;
    let subscriptionsList = subscriptions.querySelector("#items");
    return subscriptionsList;
}