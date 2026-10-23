# Portfolio

My personal site. It is plain HTML, CSS and JavaScript with no build step. Open `index.html` in a browser to run it.

## Editing the content

All the text on the site lives in `js/content.js`. I don't edit that file by hand. I use the editor instead.

1. Open `editor.html` in Chrome or Edge.
2. Click **Connect site folder** and pick this `Portfolio` folder.
3. Pick a tab, like Experience or Projects, and edit. The preview on the right updates as I type.
4. Click **Save** or press Cmd+S. That writes the changes to `js/content.js`.

Each list has an **Add** button, arrows to change the order and an ✕ to remove an entry. Entries show on the site in the same order as the editor, so the newest one goes at the top. If a list is empty, that section disappears from the site and the nav.

Wrapping words in `**double stars**` highlights them.

Logos and images can be uploaded from the editor once the folder is connected. Logos go into `images/logos` and project covers go into `images/projects`. A job or school without a logo gets a colored tile with its initials.

My resume opens in a box on the page and loads straight from OneDrive each time, so updating the PDF in OneDrive updates the site. The Profile tab holds the OneDrive share link. OneDrive blocks its own viewer inside other sites, so the page downloads the PDF and draws it with PDF.js.

If the editor is closed before saving, it keeps the edits and offers to bring them back next time. In a browser that can't write files, Save downloads `content.js` instead, and I replace `js/content.js` with it.

## Files

- `index.html` is the page layout.
- `js/content.js` holds all the text.
- `js/scripts.js` builds the page from the content.
- `editor.html`, `js/editor.js` and `css/editor.css` are the editor.
