# Instagram DM Only

A Chrome extension that restricts `instagram.com` to Direct Messages. Any attempt to
reach the feed, Explore, Reels, Stories or a post is redirected to `/direct/inbox/`,
and the Home, Explore and Reels links are removed from the navigation.

The point is to keep access to messages without the feed being one click away.

## Install

1. Open `chrome://extensions` and enable Developer mode
2. Load unpacked, and select this directory
3. Visit `instagram.com/direct/inbox/` and sign in
4. Optionally install it as an app: address bar install icon, or
   menu -> Cast, save and share -> Install page as app

Chrome shows a "disable developer mode extensions" prompt on each launch for unpacked
extensions. The alternative is packing it and self-hosting updates.

## How it works

Two mechanisms are needed because Instagram is a single-page app.

`rules.json` holds declarativeNetRequest rules that redirect `main_frame` requests. These
catch typed URLs, bookmarks and the installed app's start URL. Instagram's web manifest
points at `/`, so launching the app loads the feed URL and is redirected, which shows a
brief flash.

`fence.js` handles in-app navigation, which never produces a network request the rules
can see. A content script runs in an isolated world and cannot hook the page's own
`history` calls, so it polls `location.pathname` every 300ms and calls `location.replace`
when the path is out of bounds.

`fence.css` hides the navigation links so there is less to click.

## Scope

Redirected: `/`, `/explore`, `/reels`, `/reel/...`, `/p/...`, `/tv/...`, `/stories/...`

Left alone: `/direct/*`, `/accounts/*` and profile URLs such as `/someone`. Search also
works, so profiles remain reachable. To hide search, add `a[href^="/explore/search"]` to
`fence.css`.

To allow post links shared in a DM, remove `p` and `reel` from both regexes in
`rules.json` and from `BLOCKED` in `fence.js`.

## Limitations

Reloading after an edit requires the reload button on the extension's card at
`chrome://extensions`; the declarativeNetRequest rules do not reload on page refresh.

While signed out, Instagram serves its login page at `/`, which these rules redirect away
from. Go to `instagram.com/accounts/login/` directly, which is not fenced.

Mobile Chrome has no extension support. On Android the equivalent is Firefox with
LeechBlock NG, blocking `instagram.com` with exceptions for `/direct/*` and `/accounts/*`
and a redirect to the inbox. On iOS the approach does not work at all, because Safari
extensions do not run in home screen web apps.
