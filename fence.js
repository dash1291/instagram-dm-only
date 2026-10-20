const INBOX = "/direct/inbox/";
const BLOCKED = /^\/(explore|reels|reel|p|tv|stories)(\/|$)/;

function enforce() {
  const path = location.pathname;
  if (path === "/" || BLOCKED.test(path)) {
    location.replace(INBOX);
  }
}

enforce();
setInterval(enforce, 300);
