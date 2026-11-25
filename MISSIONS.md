# Missions

Each mission ships something real and teaches one habit. Your first session starts with
an interview; Claude uses it to fill in a project for each mission in your private
`PROGRESS.md`. Go in order unless you already know a step.
Pick projects **you** actually want; the examples are just examples.

| # | Mission | You ship | The habit |
|---|---|---|---|
| 0 | **First build** (claude.ai, no install) | A playable web game or tool, built by describing it | Describe the outcome, not the steps |
| 1 | **Your own workshop** | Claude Code running, your first page, git as your undo button, and the page live on the internet if you choose | Git is your undo button |
| 2 | **Catch it lying** | A small app *with tests*; plus one bug you found that Claude missed | "Done" means proven, not claimed |
| 3 | **Plan the big one** | Something you'd use weekly (Discord bot, tracker, mod, scraper) | Plan first, build in small steps |
| 4 | **Teach it once** | Your own `CLAUDE.md` rules and one custom `/skill` | Corrections compound |
| 5 | **Runs while you sleep** | A scheduled job that does something daily and tells you if it failed | Automate, then watch for silence |
| 6 | **Two brains** | Same problem given to two models; you judge which answer is right | Second opinions, orchestration |
| 7 | **Build for someone else** | A tool for a real system someone runs, like a family member's home, farm or shop | Real users and real systems break your assumptions |

## Mission 1: putting it online
Do this only when your page works on your own computer **and you want it online**.
It is your call; the mission counts without it. Claude runs the commands with you.

1. Make a free GitHub account at github.com if you don't have one.
2. Create a new, empty repository. Choose **Public**: a free account can only publish
   a website from a public repository. Your `PROGRESS.md` is not part of it and stays
   on your computer.
3. Claude checks `git status` with you first. `PROGRESS.md` and any `.env` file must
   not be in the list.
4. Push your work to that repository.
5. On GitHub: Settings → Pages → Deploy from a branch → pick your branch and
   `/ (root)` → Save.
6. Open the address GitHub gives you. The page loading there is the proof.

Anything in a public repository can be read by anyone, so keep names, addresses and
anything private out of the files you publish.

## Mission 5: a job that runs by itself
A scheduled job is registered with your computer, outside this folder. Run it by hand
first. Then Claude shows you the exact change, how to check it ran, and how to remove
it, and waits for your yes. After it's running, break it on purpose once to see that
it tells you.

## Mission 6: two models
The second model can be a free one. Use a task with an answer you can check. Claude
asks before you open a new account or pay for anything.

## Mission 7: working on someone else's system
The person whose system it is decides what you get access to, and when. Expect to start
**read-only**: dashboards, reports, alerts. Earn write access (anything that switches,
moves or spends something) by showing your read-only tool is solid. Their credentials
never go in your repo or your chat with Claude.

## How each mission ends
1. Show someone it working.
2. Answer three questions in `PROGRESS.md`: what did you build, where did the AI get it
   wrong, what would you do differently?
3. From Mission 1 on, commit your work. Push only if you chose to put it online.

## Rules of the road
- Start every session with: *"Let's start."* Claude reads where you left off.
- Stuck for more than 15 minutes? Ask Claude to explain the problem back to you before
  it tries to fix it.
- If you don't understand something it did, ask. "Explain that like I'm new" is always
  a fair question.
